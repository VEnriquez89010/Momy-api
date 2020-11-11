var express = require('express');
var router = express.Router();
var appSettings  = require('../models/app-settings');

router.get('/', function(req, res, next) {
  res.send('Momy API');
});

module.exports = router;
