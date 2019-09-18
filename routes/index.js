var express = require('express');
var router = express.Router();
var Location = require('../model/locationModel');
var _ = require('lodash');

/* GET home page. */
router.get('/', function (req, res, next) {
  Location.find((err, locations) => {
    if (!err) {
      console.log(locations);
      res.render('index', {
        locations: locations
      });
    } else {
      console.log(err);
    }
  })
});

module.exports = router;