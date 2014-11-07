var UntappdClient = require("node-untappd");
var _ = require('underscore');

exports.friends = function(token, cb){
  var untappd = new UntappdClient(true);
  untappd.setAccessToken(token);
  
  untappd.userFriends(function(err, friendsResult){
    if (err){
      return cb(err);
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

exports.info = function(){
  
}
