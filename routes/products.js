var express = require('express');
var router = express.Router();
var pool = require('../connection-query');


router.get('/', (req, res) => {
    pool.query('SELECT * FROM products\n' +
        'inner JOIN details on products.details_id = details.id\n' +
        'ORDER BY products.id ASC', (error, results) => {
        if (error) {
            res.status(404);
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM products\n' +
        'inner JOIN details on products.details_id = details.id\n' +
        'WHERE products.id = $1\n' +
        'ORDER BY products.id ASC',[id] ,(error, results) => {
        if (error) {
            res.status(404);
            throw error;
        }
        res.status(200).json(results.rows);
    });
});


module.exports = router;

