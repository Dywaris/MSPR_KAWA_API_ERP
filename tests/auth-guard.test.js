const request = require("supertest");
const app = require("../app");
const credential = require('../client-env.json');
const importedFunction = require('../routes/authGuard');


describe("Test authGuard file", () => {


    const mockResponse = () => {
        const res = {};
        res.status = (v) => {res.mockStatus = v; return  res};
        res.json = (v) => {res.mockJson = v; return  res};
        return res;
    };
    test("checkToken good token", async () => {
        const header = {
            token : credential.token
        };
        const response = await importedFunction.checkToken(header);
        expect(response).toBe(true);
    });

    test("checkToken wrong token", async () => {

        const header = {
            token : "AZERTY"
        };
        const response = await importedFunction.checkToken(header, mockResponse());
        const errorCode = response.mockJson.errorCode
        expect(response.mockStatus).toBe(403);
        expect(errorCode).toBe(4001);

    });


    test("checkToken missing token", async () => {
        const header = {};
        const response = await importedFunction.checkToken(header, mockResponse());
        const errorCode = response.mockJson.errorCode;
        expect(response.mockStatus).toBe(403);
        expect(errorCode).toBe(4000);
    });

    test(" test connection", async () => {
        const authParams = {
            token: credential.token,
            email: credential.email
        };
        const response = await request(app).post('/auth').send(authParams);
        expect(response.status).toBe(201);
    });

    test(" test wrong connection", async () => {
        const authParams = {
            token: 'AZERTY',
            email: credential.email
        };
        const response = await request(app).post('/auth').send(authParams);
        const errorCode = JSON.parse(response.text).errorCode;
        expect(response.status).toBe(403);
        expect(errorCode).toBe(4002);
    });


    afterAll(done => {
        app.close(() => {
            setTimeout(done, 100)
        })
    });
});

