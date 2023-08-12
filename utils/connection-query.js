const {Client} = require('pg');

module.exports.getClient = async () => {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'paye_ton_kawa',
        password: 'example',
        port: 5434,
    });
    await client.connect();
    return client;
};
