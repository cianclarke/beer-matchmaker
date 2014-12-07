var analyse = require('./analyse');
var beer = require('./beer');
var user = require('./user');
var _ = require('underscore');
var async = require('async');

module.exports = function(token, me, lat, long, radius, cb){
  analyse.getUserCheckinsAndAnalyse(token, me, function(err, userCheckins){
    if (err){
      return cb(err);
    }
    var getters = [],
    offset = 0,
    total = 200;
    
    while (offset <= total){
      (function(offset){
        getters.push(
          function(asyncCb){
            beer.nearby(token, lat, long, radius, offset, asyncCb);
          }
        );
      })(offset);
      offset += 25;
    }
    
    async.parallel(getters, function(err, asyncCombinedRes){
      if (err){
        return cb(err);
      }
      
      var localCheckins = _.flatten(asyncCombinedRes),
      matches = [];
      _.each(localCheckins, function(checkin){
        var name = checkin.brewery.brewery_name + ' - ' + checkin.beer.beer_name;
        if (userCheckins.beers.hasOwnProperty(name)){
          matches.push({
            their : checkin.rating_score,
            your : userCheckins.beers[name].rating,
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
