var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/users', function (req, res, next) {
  res.render('users');
});

router.get('/phone', function (req, res, next) {
  res.render('phone');
});

router.get('/brand', function (req, res, next) {
  res.render('brand');
});

module.exports = router;
