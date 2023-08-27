const request = require("supertest");
const app = require("../app");
const credential = require('../client-env.json');
let {sequelize, Sequelize} = require('../Models/index');
let User = require('../Models/Users')(sequelize, Sequelize.DataTypes);
let Products = require('../Models/Products')(sequelize, Sequelize.DataTypes);
let Product_details = require('../Models/Product_details')(sequelize, Sequelize.DataTypes);

describe("Test the product path", () => {


    beforeAll(async () => {
        await sequelize.sync();
        const plop = await User.create({
            nom: 'ju',
            prenom: 'dez',
            email: 'email@exemple.com',
            cles_securite: 'azerty123654789'
        });
        await Product_details.create({
            id: 1,
            price: "921.00",
            description: "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
            color: "cyan"
        });
        await Products.create({
            id: 4,
            name: "Leroy Skiles",
            stock: 90601,
            details_id: 1,
        })
    });

    test(" GET All products", async () => {
        const response = await request(app).get("/products").set('token', 'azerty123654789');
       expect(response.status).toBe(200);
    });

    test(" GET ONE products", async () => {
        const response = await request(app).get("/products/4").set('token','azerty123654789');
        expect(response.status).toBe(200);
    });


    test(" GET products doesn't exist", async () => {
        const response = await request(app).get("/products/84").set('token','azerty123654789');
        expect(response.status).toBe(404);
    });

    afterAll(done => {
        app.close(() => {
            setTimeout(done, 100)
        })
    });
});


