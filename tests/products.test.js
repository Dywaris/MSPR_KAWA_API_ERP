const request = require("supertest");
const app = require("../app");
const credential = require('../client-env.json');

describe("Test the root path", () => {
    test(" GET All products", async () => {
        const response = await request(app).get("/products").set('token', credential.token);
       expect(response.status).toBe(200);
    });

    test(" GET ONE products", async () => {
        const response = await request(app).get("/products/2").set('token', credential.token);
        expect(response.status).toBe(200);
    });

    afterAll(done => {
        app.close(() => {
            setTimeout(done, 100)
        })
    });
});


