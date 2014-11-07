var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/config.js');

/* GET home page. */
router.get('/callback', function(req, res) {
  doOAuth(req, function(err, access_token){
    if (err){
      return res.render('error', {
          message: error.message,
          error: undefined
      });
    }
    req.session.access_token = access_token;
    res.redirect('/match');
  });
});

function doOAuth(req, cb){
  if (req.query.code){
    var code = req.query.code;
    
    var url = "https://untappd.com/oauth/authorize/?client_id=" + config.clientId + "&client_secret=" + config.clientSecret + "&response_type=code&redirect_url=" + config.redirectUrl() + "&code=" + code;
    request({url : url, json : true}, function(err, response, body){
      if (err){
        return cb(err);
      }
      if (response.statusCode !== 200){
        return cb({message : body.meta.error_detail});
      }
      return cb(null, body.response.access_token)
    });
  }else{
    return cb({message : 'Failed to authenticate against UnTappd - please try again.'})
  }  
}

module.exports = router;
