var express = require('express');
var router = express.Router();
var analyse = require('../lib/analyse.js');
var user = require('../lib/user.js');
var nearby = require('../lib/nearby.js');
var errorHandler = require('./error');

/* GET match friend pick page. */
router.get('/', function(req, res) {
  var token = req.session.access_token;
  
  if (!token){
    return res.redirect('/');
  }
  var username = req.session.user_name || '';
  
  user.infoAndFriends(token, username, function(err, userResult){
    if (err){
      return errorHandler(res, 'Error retrieving users info', err);
    }
    
    // store this user's username for future use
    req.session.user_name = userResult.user_name;
    
    return res.render('match', {
      friends : userResult.friends,
      me : userResult.user_name
    });  
  });
});

/* GET match friend pick page. */
router.get('/nearby', function(req, res) {
  var token = req.session.access_token;
  
  if (!token){
    return res.redirect('/');
  }
  var username = req.session.user_name,
  radius = parseInt(req.query.radius);
  if (isNaN(radius)){
    radius = 25;
  }
  if (radius === -1){
    // Means unlimited
    radius = undefined;
  }
  
  if (!username){
    return res.redirect('/match');
  }
  
  nearby(token, username, req.query.lat, req.query.long, radius, function(err, nearbyResult){
    if (err){
      return errorHandler(res, 'Error finding nearby matches', err);
    }
    
    return res.render('nearby', {
      me : username,
      matches : nearbyResult.matches,
      nearby : nearbyResult.nearby
    });  
  });
});

router.get('/sample', function(req, res){  
  return res.render('matchresult', { match : require('../test/fixtures/mockMatch.js'), a : 'georgewbush', b : 'paedobear' });
});

router.get('/result', function(req, res){
  var token = req.session.access_token,
  userA = req.query.a,
  userB = req.query.b;
  if (!token){
    return res.redirect('/');
  }
  
  if (!userA || !userB){
    return errorHandler(res, 'Must specify two users', {});
  }
  
  if (req.query.mock){
    return res.render('matchresult', { match : require('../test/fixtures/mockMatch.js'), a : userA, b : userB });
  }
  
  analyse.compareUsers(token, userA, userB, function(err, matchRes){
    if (err){
      return errorHandler(res, 'Error matching you against this user', err);
    }
    
    return res.render('matchresult', { match : matchRes, a : userA, b : userB });
  });

});

module.exports = router;
