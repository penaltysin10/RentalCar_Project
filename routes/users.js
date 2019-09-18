var express = require('express');
var router = express.Router();
var _ = require('lodash');
var Customer = require('../model/customerModel');

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.render('userLogin');
});
router.post('/login', function (req, res, next) {
  Customer.findOne({
    email: req.body.email
  }, (err, data) => {
    if (!err) {
      let errorMsg = {};
      let firstname = req.body.firstname;
      let lastname = req.body.lastname;
      let email = req.body.email;
      let password = req.body.password;
      let tel = req.body.tel;
      if (data == null) {
        if (password.length < 8 || password.length > 16) {
          errorMsg.password = "Password must be 8 - 16 characters."
        }
        if (tel.length != 10) {
          errorMsg.tel = "Telephone number is wrong, example 0899213456, 0998234176"
        }
        if (Object.entries(errorMsg).length === 0 && errorMsg.constructor === Object) {
          var doc = new Customer(req.body);
          doc.save((err, data) => {
            if (!err) {
              console.log("Register is success");
              res.render('userLogin');
            } else {
              console.log("Error: register is not success");
            }
          });
        } else {
          res.render('userRegister', {
            errorMsg: errorMsg,
            firstname: firstname,
            lastname: lastname,
            email: email
          });
        }
      } else {
        errorMsg.email = "Email is already exists."
        res.render('userRegister', {
          errorMsg: errorMsg,
          firstname: firstname,
          lastname: lastname,
          email: email
        });
      }
    } else {
      console.log(err);
    }
  });
});
router.get('/company', function (req, res, next) {
  res.render('companyLogin');
});
router.get('/register', function (req, res, next) {
  res.render('userRegister');
});

module.exports = router;