const request = require("supertest");
const app = require("../app");
const credential = require('../client-env.json');
const importedFunction = require('../routes/authGuard');
let {sequelize, Sequelize} = require('../Models/index');
let User = require('../Models/Users')(sequelize, Sequelize.DataTypes);

describe("Test authGuard file", () => {

    beforeAll(async () => {
        await sequelize.sync();
        const plop = await User.create({
            nom: 'ju',
            prenom: 'dez',
            email: 'email@exemple.com',
            cles_securite: 'azerty123654789'
        });
    });
    const mockResponse = () => {
        const res = {};
        res.status = (v) => {res.mockStatus = v; return  res};
        res.json = (v) => {res.mockJson = v; return  res};
        return res;
    };
    test("checkToken good token", async () => {
        const header = {
            token : 'azerty123654789'
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
            token: 'azerty123654789',
            email: 'email@exemple.com'
        };
        const response = await request(app).post('/auth').send(authParams);
        expect(response.status).toBe(201);
    });

    test(" test wrong connection", async () => {
        const authParams = {
            token: 'AZERTY',
            email:'email@exemple.com'
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

