import Zombie from '../models/zombie';
import services from '../services/zombies';
import apis from '../apis';

export default {
    async getOne(req, res, next) {
        // find zombie in db
        const { id } = req.params;
        const zombie = await services.getOneZombie(id);

        if (!zombie) {
          return res.status(204).send({error: 'Data not found'});
        }

        // get data from services
        const zombieItems = await apis.getZombieItems();
        const { usd, eur } = await apis.getCurrencyRates();

        // calculate all items value in PLN
        const itemsInPLN = zombie.items.reduce((value, id) => {
          const item = zombieItems.find(i => i.id === id);
          if (!item) {
            return value;
          }
          return value + item.price;
        }, 0);

        // calculate total value in different currencies
        const itemsValue = {
            pln: itemsInPLN,
            usd: Math.round(itemsInPLN / usd * 100) / 100,
            eur: Math.round(itemsInPLN / eur * 100) / 100,
        }

        const data = { ...zombie._doc, itemsValue }

        return res.status(200).send({data: data});
    },

    async getAll(req, res) {
          const sort_by = {};
          sort_by[req.query.sort_by || 'created_at'] = req.query.order_by || 'desc';
          const offset = parseInt(req.query.offset);
          const per_page = parseInt(req.query.per_page);

          const zombiesPromise = services.getAllZombies(req.filters, offset, per_page, sort_by);
          const countPromise = services.getZombieCount(req.filters);
          const [zombies, count] = await Promise.all([zombiesPromise, countPromise]);

          return res.status(200).send({ data: zombies, count });
    },

    async create(req, res) {
        const { name, items } = req.body;
        if (!name) {
          return res.status(400).send({validationError: 'name is required'});
        }

        const zombie = await services.createZombie({
            name: name,
            items: items
        });

        return res.status(201).send({ data: zombie, message: `Zombie was created` });
    },

    async update(req, res, next) {
        const { id } = req.params;
        const { name, items } = req.body;

        if (!name) {
          return res.status(400).send({validationError: 'name is required'});
        }

        const zombie = await services.updateZombie( id, {
            name: name,
            items: items || []
          }, { new: true }
        );

        if (!zombie) {
          return res.status(204).send({error: 'Data not found'});
        }

        return res.status(200).send({ data: zombie, message: `Zombie was updated` });
    },

    async remove(req, res, next) {
        const { id } = req.params;

        await services.deleteZombie(id);

        return res.status(200).send({ message: `Zombie was removed` });
    }
}
