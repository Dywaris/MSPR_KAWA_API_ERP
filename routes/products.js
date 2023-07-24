var express = require('express');
var router = express.Router();
const https = require('https');


router.get('/', (req, res) => {
    https.get('https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products', function(rep) {
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

