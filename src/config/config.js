// ['NODE_ENV', 'API_PORT', 'CURRENCY_EXCHANGE_URL', 'ZOMBIE_ITEMS_EXCHANGE_URL'].forEach((name) => {
//     if (!process.env[name]) {
//         throw new Error(`Environment variable ${name} is missing`)
//     }
// });

export default {
    env: process.env.NODE_ENV,
    server: {
        port: process.env.API_PORT || 9001
    },
    zombieItemsExchangeURL: process.env.ZOMBIE_ITEMS_EXCHANGE_URL || 'https://zombie-items-api.herokuapp.com/api/items',
    currencyExchangeURL: process.env.CURRENCY_EXCHANGE_URL || 'http://api.nbp.pl/api/exchangerates/tables/C/today/',
};
