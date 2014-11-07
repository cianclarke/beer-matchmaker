var express = require('express');
var router = express.Router();
var beers = require('../lib/beers.js');

router.get('/:user', function(req, res) {
  var token = req.session.access_token,
  user = req.params.user;
  
  if (!token){
    res.redirect('/');
  }
  
  beers.getUserCheckinsAndAnalyse(token, user, function(err, userRes){
    if (err){
      return res.render('error', {
          message: 'Error retrieving your user',
          error: err
      });
    }
    return res.json(userRes);  
  });
});

module.exports = router;
