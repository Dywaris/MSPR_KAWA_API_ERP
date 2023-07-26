let pool = require('../utils/connection-query');

function checkToken(headers, res) {
    return new Promise((resolve) => {
        if (headers.token) {
            pool.query('SELECT * FROM users\n' +
                'WHERE cles_securite = $1', [headers.token], async (error, results) => {
                if (error) {
                    return res.status(500).json({errorCode: 5000, description: 'Connection BDD failed'});
                }
                if (results.rows.length !== 1) {
                    return res.status(403).json({errorCode: 4001, description: 'Wrong token in header'});
                }
                resolve();
            });
        } else {
            return res.status(403).json({errorCode: 4000, description: 'Missing token in header'});
        }
    });
}

module.exports = checkToken;
