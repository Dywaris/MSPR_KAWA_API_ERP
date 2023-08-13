let express = require('express');
let router = express.Router();
var {getClient} = require('../utils/connection-query');
var crypto = require("crypto");
const credential = require('./../client-env.json');
let nodemailer = require('nodemailer');
let qrcode = require('qrcode');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create an user
 *     description: Create an user in database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *      201:
 *         description: Successful operation.
 *
 */
router.post('/', function(req, res) {
  createUser(req, res);
});

async function createUser(req, res) {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  if (firstname && lastname && email) {
    const alreadExist = await emailAlreadyExist(email);
    if (alreadExist !== true) {
      const token = crypto.randomBytes(26).toString('hex');
      const client = await getClient();
      client.query('INSERT INTO users (nom, prenom, email, cles_securite) VALUES ($1,$2, $3, $4)',
          [lastname, firstname, email, token] , async (error, results) => {
            await client.end();
            if (error) {
          return res.status(500).json({errorCode: 5001, description: 'Insert BDD failed'});
        } else {
          sendMail(req, res, email, token);
        }
      });
    } else {
      return res.status(500).json({errorCode: 5002, description: 'User already created'});
    }
  } else {
    return res.status(500).json({errorCode: 5003, description: 'Missing parameters'});
  }

}

async function emailAlreadyExist(email) {
  return new Promise(async (resolve) => {
    const client = await getClient();
    client.query('SELECT * FROM users\n' +
        'WHERE email = $1',[email], async (error, results) => {
      await client.end();
      if (error) {
        return res.status(500).json({errorCode: 5000, description: 'Connection BDD failed'});
      }
      return resolve(results.rows.length !== 0);
    });
  });
}

function generateQrcode(token) {
  return qrcode.toDataURL(token).then((url) => {
    return url;
  })
}

async function sendMail(req, res, email, token) {

  var qrcodeurl = await generateQrcode(token);
  // login
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: credential.gmail.email,
      clientId: credential.gmail.clientId,
      clientSecret: credential.gmail.clientSecret,
      accessToken: credential.gmail.accessToken,
      refreshToken: credential.gmail.refreshToken
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var message = {
    from:  credential.gmail.email,
    to: email,
    attachDataUrls: true,
    subject: 'QRCODE auth',
    text: 'je suis un deve',
    html: '<b>Contact Nom</b>:Julien<br/><b>Contact Email</b>: ' +
        '<img src="' + qrcodeurl + '" alt="qrCode">'
  };
    // send mail with defined transport object
    transporter.sendMail(message, function(error, info){
      if(error){
        return res.status(500).json({errorCode: 5004, description: 'Error mail server, mail not send'});
      }
      else{
        return res.status(201).json('OK');
      }
    });
}
module.exports = router;
