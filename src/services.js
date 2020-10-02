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
        const resp = await axios.get(config.zombieItemsExchangeURL);

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
