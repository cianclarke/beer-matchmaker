var express = require('express');
var router = express.Router();
var beers = require('../lib/beers.js');
var user = require('../lib/user.js');

/* GET home page. */
router.get('/', function(req, res) {
  var token = req.session.access_token;
  
  if (!token){
    return res.redirect('/');
  }
  
  user.friends(token, function(err, friends){
    if (err){
      return res.render('error', {
          message: 'Error retrieving users',
          error: {}
      });    
    }
    return res.render('match', {
      friends : friends,
      me : 'cianclarke' // TODO: How TF to we find out who the authed user is!?
    });  
  });
  
  
  
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
  
  beers.compareUsers(token, userA, userB, function(err, matchRes){
    if (err){
      console.log(err);
      return res.render('error', {
          message: 'Error matching you against this user',
          error: err
      });
    }
    
    console.log(matchRes);
    
    return res.render('matchresult', { match : matchRes, a : userA, b : userB });
  });

});

module.exports = router;
