const request = require("supertest");
const app = require("../app");
const credential = require('../client-env.json');
const importedFunction = require('../routes/users');
var crypto = require("crypto");

describe("Test User file", () => {
    test("Generate QRCODE", async () => {
        const response = await importedFunction.generateQrcode("Ceci est un token");
        expect(typeof response).toBe('string');
    });

    test("Check if email exist", async () => {
        const response = await importedFunction.emailAlreadyExist("exmplae@email.com");
        expect(typeof response).toBe('boolean');
    });

    test("Check send email", async () => {
        const mockResponse = () => {
            const res = {};
            res.status = (v) => {res.mockStatus = v; return  res};
            res.json = () => {return  res};
            return res;
        };
        const response = await importedFunction.sendMail({}, mockResponse(),"exmplae@email.com", "Ceci est un token");
        expect(response.mockStatus).toBe(201);
    });

    test("Test create User with missing Parameters", async () => {
        const newUser = {
            firstname: 'user1',
            email: crypto.randomBytes(5).toString('hex') +'@exemple.com'
        };

        const response = await request(app).post('/users').send(newUser).set('token', credential.token);
        const errorCode = JSON.parse(response.text).errorCode;
        expect(response.status).toBe(500);
        expect(errorCode).toBe(5003);
    });



    test("Create User with check Email and Qrcode generation and send mail", async () => {
        const newUser = {
            firstname: 'user1',
            lastname: 'user1',
            email: crypto.randomBytes(5).toString('hex') +'@exemple.com'
        };
        const response = await request(app).post('/users').send(newUser).set('token', credential.token);
        expect(response.status).toBe(201);
    });

    test("Test of the creation of a user already created", async () => {
        const newUser = {
            lastname: 'user1',
            firstname: 'user1',
            email: credential.email
        };
        const response = await request(app).post('/users').send(newUser).set('token', credential.token);
        const errorCode = JSON.parse(response.text).errorCode;
        expect(response.status).toBe(500);
        expect(errorCode).toBe(5002);
    });



    afterAll(done => {
        app.close(() => {
            setTimeout(done, 100)
        })
    });
});

