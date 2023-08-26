const express = require('express');
const router = express.Router();
let {sequelize, Sequelize} = require('../Models/index');
let User = require('../Models/Users')(sequelize, Sequelize.DataTypes);

function checkToken(headers, res) {
    return new Promise(async (resolve) => {
        if (headers.token) {
            const user = await User.findOne({where:{cles_securite: headers.token}});
                if (user) {
                    return resolve(true);
                } else {
                    return resolve(res.status(403).json({errorCode: 4001, description: 'Wrong token in header'}));
                }
        } else {
            return  resolve(res.status(403).json({errorCode: 4000, description: 'Missing token in header'}));
        }
    });
}

router.post('/', async (req, res) => {
    const email = req.body.email;
    const token = req.body.token;
    const user = await User.findOne({where: { cles_securite: token,  email: email }});
    if(user) {
        return res.status('201').json('OK');
    } else {
        return res.status(403).json({errorCode: 4002, description: 'Wrong combinations'});
    }

});

module.exports = {checkToken, router};
