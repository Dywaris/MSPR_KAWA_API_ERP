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
          return sendMail(req, res, email, token);
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

async function generateQrcode(token) {
  return qrcode.toDataURL(token).then((url) => {
    return url;
  })
}

async function sendMail(req, res, email, token) {
  return new Promise(async (resolve) => {

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
      from: credential.gmail.email,
      to: 'dywaris@gmail.com',
      attachDataUrls: true,
      subject: 'PayeTonKawa connexion',
      html:          ' <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">\n' +
          '        <tr>\n' +
          '            <td style="padding: 20px; text-align: center;">\n' +
          '                <img src="logo_payetonkawa.png" alt="PayeTonKawa Logo" style="max-width: 150px;">\n' +
          '                <h1 style="margin-top: 20px;">Connexion à votre compte</h1>\n' +
          '                <p>Merci de scanner le QR code ci-dessous pour vous connecter à votre compte PayeTonKawa :</p>\n' +
          '                <img  src="' + qrcodeurl + '" alt="QR Code de connexion" style="max-width: 200px; margin-top: 10px;">\n' +
          '            </td>\n' +
          '        </tr>\n' +
          '        <tr>\n' +
          '            <td style="padding: 20px; text-align: center; background-color: #f5f5f5;">\n' +
          '                <p style="margin: 0;">Si vous avez des questions ou avez besoin d\'assistance, n\'hésitez pas à nous contacter à l\'adresse suivante : <a href="mailto:contact@payetonkawa.fr">contact@payetonkawa.fr</a></p>\n' +
          '            </td>\n' +
          '        </tr>\n' +
          '    </table>\n' +
          '\n' +
          '    <p style="text-align: center; margin-top: 20px; color: #888;">Cet e-mail a été envoyé par PayeTonKawa - Tous droits réservés</p>'
    };
    // send mail with defined transport object
    transporter.sendMail(message, function (error, info) {
      if (error) {
       return  resolve(res.status(500).json({errorCode: 5004, description: 'Error mail server, mail not send'}));
      } else {
        return resolve(res.status(201).json({status:'ok'}));
      }
    });
  });
}
module.exports = {router, emailAlreadyExist, sendMail, generateQrcode};
