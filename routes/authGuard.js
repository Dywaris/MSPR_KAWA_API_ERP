const pool = require('../utils/connection-query');
const express = require('express');
const router = express.Router();
const { getClient } = require('../utils/connection-query');

function checkToken(headers, res) {
    return new Promise(async (resolve) => {
        if (headers.token) {
            const client =  await getClient();
            client.query('SELECT * FROM users\n' +
                'WHERE cles_securite = $1', [headers.token], async (error, results) => {
                await client.end();
                if (error) {
                    return  resolve(res.status(500).json({errorCode: 5000, description: 'Connection BDD failed'}));
                }
                if (results.rows.length !== 1) {
                    return resolve(res.status(403).json({errorCode: 4001, description: 'Wrong token in header'}));
                }
                return resolve(true);
            });
        } else {
            return  resolve(res.status(403).json({errorCode: 4000, description: 'Missing token in header'}));
        }
    });
}

router.post('/', async (req, res) => {
    const email = req.body.email;
    const token = req.body.token;
    const client =  await getClient();
    client.query('SELECT * FROM users\n' +
        'WHERE email = $1 and cles_securite = $2',[email, token], async (error, results) => {
        await client.end();
        if (error) {
            return res.status(500).json({errorCode: 5000, description: 'Connection BDD failed'});
        }
        if (results.rows.length !== 1) {
            return res.status(403).json({errorCode: 4002, description: 'Wrong combinations'});
        }
        return res.status('201').json('OK');
    });
});

module.exports = {checkToken, router};
