const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'paye_ton_kawa',
    password: 'example',
    port: 5434,
});
module.exports = pool;
