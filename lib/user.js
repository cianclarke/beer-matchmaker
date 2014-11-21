var UntappdClient = require("node-untappd"),
cache = require('./cache'),
config = require('../config/config.js'),
_ = require('underscore');

exports.friends = function(token, cb){
  var untappd = new UntappdClient(false);
  untappd.setAccessToken(token);
  untappd.setClientId(config.clientId);
  untappd.userFriends(function(err, friendsResult){
    if (err){
      return cb(err);
    }
    if (!friendsResult.response || !friendsResult.response.items){
      return cb(friendsResult);
    }
    var friends = _.map(friendsResult.response.items, function(friend){
      return {
        username : friend.user.user_name,
        first_name : friend.user.first_name,
        last_name : friend.user.last_name,
        user_avatar : friend.user.user_avatar
      };
    });
    return cb(null, friends)
  }, '')
  
}

exports.info = function(token, user, cb){
  // nb user can be ''
  var cacheKey;
  
  if (user !== ''){
    cacheKey = 'userinfo-' + user;
  }
  cache.get(cacheKey, function(err, res){
    if (!err && typeof res !== 'undefined'){
      return cb(null, res);
    }
    var untappd = new UntappdClient(false);
    untappd.setAccessToken(token);
    untappd.setClientId(config.clientId);
    return untappd.userInfo(function(err, userResponse){
      if (err){
        return cb(err);
      }
      
      if (!userResponse.response || !userResponse.response.user){
        // throw an error
        return cb(userResponse);
      }
      
      var filteredUser = userResponse.response.user;
      
      if (!cacheKey){ // when we request info for this user, user is '' - so we don't get a cachekey
        cacheKey = 'userinfo-' + filteredUser.user_name;
      }
      cache.set(cacheKey, filteredUser, cache.EXPIRES, function(){});
      
      return cb(null, filteredUser);
    }, user);
  });
}

exports.infoAndFriends = function(token, username, cb){
  // pasing '' means auth'd user
  exports.info(token, username, function(err, user){
    if (err){
      return cb(err);
    }
    exports.friends(token, function(err, friends){
      if (err){
        return cb(err);
      }
      user.friends = friends;
      return cb(null, user);
    });
  })
}
