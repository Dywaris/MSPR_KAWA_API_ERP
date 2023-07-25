var express = require('express');
var router = express.Router();
var pool = require('../connection-query');
var rand = require("generate-key");

/* GET users listing. */
router.post('/', function(req, res, next) {
  createUser(req, res);
});

function createUser(req, res) {
  console.log(req);
  let firstname = req.query.firstname;
  let lastname = req.query.lastname;
  let email = req.query.email;
  console.log(firstname, lastname, email);
  if (firstname && lastname && email) {
    if (!emailAlreadyExist(email)) {
      const token = rand.generateKey();
      console.log(token);
      pool.query('INSERT INTO users (nom, prenom, email, cles_securite) VALUES ($1,$2, $3, $4)',
          [lastname, firstname, email, token] ,(error, results) => {
        if (error) {
          console.log(error);
          res.status(404);
        } else {
          res.status(201, 'ok');
          // creaation succed => send mail
        }
      });

    } else {
      res.status(500, 'already existe');
      // error already existe
    }

  } else {
    res.status(500, 'mmissing parameters');
    // code error missing parameters
  }

}

function emailAlreadyExist(email) {
  pool.query('SELECT * FROM users\n' +
      'WHERE email = $1',[email], (error, results) => {
    if (error) {
      res.status(404);
      throw error;
    }
    return results.rows.length !== 0;
  });
}

module.exports = router;
