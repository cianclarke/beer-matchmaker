var express = require('express');
var router = express.Router();
var analyse = require('../lib/analyse.js');
var user = require('../lib/user.js');

/* GET match friend pick page. */
router.get('/', function(req, res) {
  var token = req.session.access_token;
  
  if (!token){
    return res.redirect('/');
  }
  var username = req.session.user_name || '';
  
  user.infoAndFriends(token, username, function(err, userResult){
    if (err){
      return res.render('error', {
          message: 'Error retrieving users info',
          error: err
      });    
    }
    
    // store this user's username for future use
    req.session.user_name = userResult.user_name;
    
    return res.render('match', {
      friends : userResult.friends,
      me : userResult.user_name
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
    return res.render('error', {
        message: 'Must specify two users',
        error: {}
    });  
  }
  
  if (req.query.mock){
    return res.render('matchresult', { match : require('../test/fixtures/mockMatch.js'), a : userA, b : userB });
  }
  
  analyse.compareUsers(token, userA, userB, function(err, matchRes){
    if (err){
      return res.render('error', {
          message: 'Error matching you against this user',
          error: err
      });
    }
    
    return res.render('matchresult', { match : matchRes, a : userA, b : userB });
  });

});

module.exports = router;
