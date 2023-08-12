const {Client} = require('pg');
const credential = require('./../client-env.json');

module.exports.getClient = async () => {
    const client = new Client({
        user: credential.bdd.user,
        host: credential.bdd.host,
        database: credential.bdd.database,
        password: credential.bdd.password,
        port: credential.bdd.port,
    });
    await client.connect();
    return client;
};
