const request = require("supertest");
const app = require("../app");

describe("Test the root path", () => {
    test(" GET All products", async () => {
        const response = await request(app).get("/products").set('token', 'azertyuiopqsdfghj');
       expect(response.status).toBe(200);
    });

    afterAll(done => {
        console.log('icic');
        app.close(() => {
            setTimeout(done, 100)
        })
    });
});


