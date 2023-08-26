var express = require('express');
var router = express.Router();
let checkToken = require('../routes/authGuard').checkToken;
let {sequelize, Sequelize} = require('../Models/index');
let Products = require('../Models/Products')(sequelize, Sequelize.DataTypes);
let product_details = require('../Models/Product_details')(sequelize, Sequelize.DataTypes);

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
router.get('/', async (req, res) => {
    await checkToken(JSON.parse(JSON.stringify(req.headers)), res);
    const allProducts = await Products.findAll({include: product_details});
     res.status(200).json(allProducts);
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
router.get('/:id', async (req, res) => {
    await checkToken(JSON.parse(JSON.stringify(req.headers)), res);
    const id = parseInt(req.params.id);
    const OneProduct = await Products.findOne({ where:{id: id}, include: product_details});
        if (OneProduct) {
           return res.status(200).json(OneProduct);
        } else {
            return res.status(404).json('not found');
        }
});


module.exports = router;

