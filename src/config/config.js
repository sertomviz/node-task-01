export default {
    env: process.env.NODE_ENV,
    server: {
        port: process.env.API_PORT || 9001
    },
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379
    },
    zombieItemsExchangeURL: process.env.ZOMBIE_ITEMS_EXCHANGE_URL || 'https://zombie-items-api.herokuapp.com/api/items',
    currencyExchangeURL: process.env.CURRENCY_EXCHANGE_URL || 'http://api.nbp.pl/api/exchangerates/tables/C/today/',
};
