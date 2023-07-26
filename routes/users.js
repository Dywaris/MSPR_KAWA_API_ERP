let express = require('express');
let router = express.Router();
let pool = require('../utils/connection-query');
let rand = require("generate-key");
let nodemailer = require('nodemailer');
let qrcode = require('qrcode');
/* GET users listing. */
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
      const token = rand.generateKey(26);
      pool.query('INSERT INTO users (nom, prenom, email, cles_securite) VALUES ($1,$2, $3, $4)',
          [lastname, firstname, email, token] ,(error, results) => {
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

function emailAlreadyExist(email) {
  return new Promise((resolve) => {
    pool.query('SELECT * FROM users\n' +
        'WHERE email = $1',[email], async (error, results) => {
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
      user: 'payetonkawaepsi@gmail.com',
      clientId: '555722656717-k88e6nvai6vgp987mbaps2bp70m4m187.apps.googleusercontent.com',
      clientSecret: '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',
      accessToken: 'ya29.a0AbVbY6NzHHBRFo31IbfUzy_YA2Mek4Ja6TN96ad_UgqV1A_CvW2VXE_nwtt2rDHPGczX0xgQ8zUGYZ_uZKVpA4bOdKwCE9O5FiAFnq9k_JiVA3ThHeJpo9B_K-Dwcn950p-cEA-YlLdOFN7kiCnp1NPsdwcnaCgYKAdcSARASFQFWKvPlmT0izGZB8yqO-6EzPlB0Ww0163',
      refreshToken: '1//04Kqp3effUzWUCgYIARAAGAQSNwF-L9IrV0pFxulPNYVs2xOQ6rOEPgyd90IHGrm0K4fwP_KTK4rfgShVdl9XNhYaGKquzJrumws'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var message = {
    from: 'payetonkawaepsi@gmail.com',
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
