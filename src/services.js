import axios from 'axios';
import config from './config/config';
import moment from 'moment';

let cache = {
  ratesExpireAt: 0,
  rates: {usd: 0, eur: 0 },
  itemsExpireAt: 0,
  items: []
};

export default {
  async getCurrencyRates() {
    const now = moment().valueOf();

    if ( now > cache.ratesExpireAt ) {
      try {
        console.log('getting rates from ex service');
        const resp = await axios.get(config.currencyExchangeURL);
        const usd = resp.data[0].rates.find(r => r.code === 'USD').ask;
        const eur = resp.data[0].rates.find(r => r.code === 'EUR').ask;

        cache = {
          ...cache,
          ratesExpireAt: moment().add(1, 'days').set({hour: 12, minute: 0, second: 0}).valueOf(),
          rates: { usd, eur }
        };

      } catch (err) {
        console.error(err);
      }
    }

    console.log('getting rates from cache');
    return cache.rates;
  },

  async getZombieItems() {
    const now = moment().valueOf();

    if ( now > cache.itemsExpireAt ) {
      try {
        console.log('getting items from ex service');
        //const resp = await axios.get(config.zombieItemsExchangeURL);
        const resp = {data: {"timestamp":1601596800000,"items":[{"id":1,"name":"Diamond Sword","price":100},{"id":2,"name":"Trident","price":200},{"id":3,"name":"Wooden Hoe","price":50},{"id":4,"name":"Fishing Rod","price":150},{"id":5,"name":"Elytra","price":110},{"id":6,"name":"Blue Bed","price":80},{"id":7,"name":"Toten of Undying","price":130},{"id":8,"name":"Spawn Egg","price":30},{"id":9,"name":"Leather Boots","price":50},{"id":10,"name":"Horse Saddle","price":180},{"id":11,"name":"Tonic","price":10},{"id":12,"name":"Knowledge Book","price":190},{"id":13,"name":"Flower Pot","price":40},{"id":14,"name":"Enchanted Book","price":170},{"id":15,"name":"Brown Glow Stick","price":90}]}}
        
        cache = {
          ...cache,
          itemsExpireAt: moment(resp.data.timestamp).add(1, 'days').valueOf(),
          items: resp.data.items
        };
      } catch (err) {
        console.error(err);
      }
    }
    console.log('getting items from cache');
    return cache.items;
  }
}
