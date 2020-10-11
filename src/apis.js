import axios from 'axios';
import config from './config/config';
import moment from 'moment';
import asyncRedis from 'async-redis'

const cache = asyncRedis.createClient(config.redis.port, config.redis.host)

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
      try {
        console.log('getting items from ex service');
        const resp = await axios.get(config.zombieItemsExchangeURL);

        //const resp = {data: {"timestamp":1602115200000,"items":[{"id":1,"name":"Diamond Sword","price":100},{"id":2,"name":"Trident","price":200},{"id":3,"name":"Wooden Hoe","price":50},{"id":4,"name":"Fishing Rod","price":150},{"id":5,"name":"Elytra","price":110},{"id":6,"name":"Blue Bed","price":80},{"id":7,"name":"Toten of Undying","price":130},{"id":8,"name":"Spawn Egg","price":30},{"id":9,"name":"Leather Boots","price":50},{"id":10,"name":"Horse //Saddle","price":180},{"id":11,"name":"Tonic","price":10},{"id":12,"name":"Knowledge Book","price":190},{"id":13,"name":"Flower Pot","price":40},{"id":14,"name":"Enchanted Book","price":170},{"id":15,"name":"Brown Glow Stick","price":90}]}}

        // items are valid 24hrs from its timestamp
        const itemsExpiration = moment(resp.data.timestamp).add(1, 'days').valueOf();

        await cache.set('items', JSON.stringify(resp.data.items));
        await cache.expireat('items', itemsExpiration);
        return resp.data.items;
      } catch (err) {
        console.error(err.message);
        return {items: []}
      }
    }
  }

}
