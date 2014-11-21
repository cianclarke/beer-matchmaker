var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var features = require('../config/featurepoints.js');

/* GET home page. */
router.get('/', function(req, res) {
  accessToken = req.session && req.session.access_token,
  res.render('index', { loggedIn : typeof accessToken !== 'undefined', redirectUrl : config.redirectUrl(), features : features() });
});

module.exports = router;
