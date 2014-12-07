var analyse = require('./analyse');
var beer = require('./beer');
var user = require('./user');
var _ = require('underscore');

module.exports = function(token, me, lat, long, cb){
  analyse.getUserCheckinsAndAnalyse(token, me, function(err, userCheckins){
    if (err){
      console.log('user error');
      console.log(arguments);
      return cb(err);
    }
    beer.nearby(token, lat, long, function(err, localCheckins){
      if (err){
        console.log('nearby error');
        console.log(arguments);
        return cb(err);
      }
      var matches = [];
      _.each(localCheckins, function(checkin){
        var name = checkin.brewery.brewery_name + ' - ' + checkin.beer.beer_name;
        if (userCheckins.beers.hasOwnProperty(name)){
          matches.push({
            their : checkin.rating_score,
            your : userCheckins.beers[name],
            beerName : name,
            checkin : checkin
            /*username : checkin.user.user_name,
            firstName : checkin.user.first_name,
            lastName : checkin.user.last_name,
            from : checkin.user.location,
            bio : checkin.user.bio,*/
          })
        }
      });
      return cb(null, matches);
      
    });
  });  
};
