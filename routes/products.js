var express = require('express');
var router = express.Router();
const https = require('https');
var pool = require('../connection-query');


router.get('/', (req, res) => {
    pool.query('SELECT * FROM products\n' +
        'inner JOIN details on products.details_id = details.id\n' +
        'ORDER BY products.id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
        console.log(results);
    });
});

router.get('/:id', (req, res) => {
    https.get('https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products/' + req.params.id, function(rep) {
        let rawData = '';
        rep.on('data', (chunk) => { rawData += chunk; });
        rep.on('end', () => {
            try {
                res.send(rawData);
            } catch (e) {
                console.error(e.message);
            }
        });
    });
});


module.exports = router;

