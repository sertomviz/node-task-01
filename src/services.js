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
  /*-- get currency rates from cache or from external service if cache expired --*/
  async getCurrencyRates() {
    const now = moment().valueOf();

    if ( now > cache.ratesExpireAt ) {
      try {
        console.log('getting rates from ex service');
        const resp = await axios.get(config.currencyExchangeURL);
        const usd = resp.data[0].rates.find(r => r.code === 'USD').ask;
        const eur = resp.data[0].rates.find(r => r.code === 'EUR').ask;

        // rates are valid till next day at 12:00
        const ratesExpiration = moment().add(1, 'days').set({hour: 12, minute: 0, second: 0}).valueOf();

        cache = {
          ...cache,
          ratesExpireAt: ratesExpiration,
          rates: { usd, eur }
        };

      } catch (err) {
        console.error(err);
      }
    }

    console.log('getting rates from cache');
    return cache.rates;
  },

  /*-- get Zombie items from cache or from external service if cache expired --*/
  async getZombieItems() {
    const now = moment().valueOf();

    if ( now > cache.itemsExpireAt ) {
      try {
        console.log('getting items from ex service');
        const resp = await axios.get(config.zombieItemsExchangeURL);

        // items are valid 24hrs (from timestamp)
        const itemsExpiration = moment(resp.data.timestamp).add(1, 'days').valueOf();

        cache = {
          ...cache,
          itemsExpireAt: itemsExpiration,
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
