var express = require('express');
var router = express.Router();
const https = require('https');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get list of products
 *     description: Retrieve a list of products from KAWA ERP.
 *     responses:
 *      200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: string
 *                         description: Date of creation.
 *                         example: 2023-02-20T03:49:43.205Z
 *                       name:
 *                         type: string
 *                         description: The product's name.
 *                         example: Sharon Smitham IV
 *                       details:
 *                         type: object
 *                         properties:
 *                           price:
 *                             type: string
 *                             example: 296.00
 *                           description:
 *                             type: string
 *                             example: The Apollotech B340 is an affordable wireless mouse with reliable connectivity 12 months battery life and modern design
 *                           color:
 *                             type: string
 *                             example: mint green
 *                         stock:
 *                           type: integer
 *                           format: int32
 *                           example: 59573
 *                         id:
 *                           type: string
 *                           example: 7
 */
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



/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: A single product
 *     description: Retrieve a product from KAWA ERP.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *      200:
 *         description: Successful operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: string
 *                         description: Date of creation.
 *                         example: 2023-02-20T03:49:43.205Z
 *                       name:
 *                         type: string
 *                         description: The product's name.
 *                         example: Sharon Smitham IV
 *                       details:
 *                         type: object
 *                         properties:
 *                           price:
 *                             type: string
 *                             example: 296.00
 *                           description:
 *                             type: string
 *                             example: The Apollotech B340 is an affordable wireless mouse with reliable connectivity 12 months battery life and modern design
 *                           color:
 *                             type: string
 *                             example: mint green
 *                         stock:
 *                           type: integer
 *                           format: int32
 *                           example: 59573
 *                         id:
 *                           type: string
 *                           example: 7
 */
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

