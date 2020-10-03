import axios from 'axios';
import config from './config/config';
import moment from 'moment';
import asyncRedis from 'async-redis'

const REDIS_PORT = process.env.REDIS_PORT || 6379
const cache = asyncRedis.createClient(REDIS_PORT)

export default {

  /*-- get currency rates from cache or from external service if cache expired --*/
    async getCurrencyRates() {

      const rates = await cache.get('rates');

      if (rates) {
        console.log('getting rates from cache');
        return JSON.parse(rates)
      } else {
        try {
          console.log('getting rates from ex service');
          const resp = await axios.get(config.currencyExchangeURL);
          const usd = resp?.data[0]?.rates.find(r => r.code === 'USD').ask || 0;
          const eur = resp?.data[0]?.rates.find(r => r.code === 'EUR').ask || 0;

          // rates are valid till next day at 12:00
          const ratesExpiration = moment().add(1, 'days').set({hour: 12, minute: 0, second: 0}).valueOf();

          const rates = {usd: usd ? usd : 0, eur: eur ? eur : 0};
          await cache.set('rates', JSON.stringify(rates));
          await cache.expireat('rates', ratesExpiration);

          return rates;

        } catch (err) {
          console.error(err.message);
          return {usd: null, eur: null}
        }


      }
  },

  /*-- get Zombie items from cache or from external service if cache expired --*/
  async getZombieItems() {

    const items = await cache.get('items');

    if (items) {
      console.log('getting items from cache');
      return JSON.parse(items)
    } else {
      console.log('getting items from ex service');
      const resp = await axios.get(config.zombieItemsExchangeURL);

      // items are valid 24hrs from its timestamp
      const itemsExpiration = moment(resp.data.timestamp).add(1, 'days').valueOf();

      await cache.set('items', JSON.stringify(resp.data.items));
      await cache.expireat('items', itemsExpiration);
      return resp.data.items;
    }

  }

}
