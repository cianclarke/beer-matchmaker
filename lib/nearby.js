var analyse = require('./analyse');
var beer = require('./beer');
var user = require('./user');
var _ = require('underscore');
var async = require('async');
var aUtils = require('./analyseUtils');

module.exports = function(token, me, lat, long, radius, cb){
  analyse.getUserCheckinsAndAnalyse(token, me, function(err, userCheckins){
    if (err){
      return cb(err);
    }
    var getters = [],
    offset = 0,
    total = 25; // TODO - offset doesn't work with thepub, use max_id instead :-()
    
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
      matches = [],
      nearby = [];
      _.each(localCheckins, function(checkin){
        var name = checkin.brewery.brewery_name + ' - ' + checkin.beer.beer_name,
        their = checkin.rating_score;
        if (userCheckins.beers.hasOwnProperty(name)){
          var your = userCheckins.beers[name].rating,
          diff = aUtils.diff(their, your),
          desc = aUtils.describe(diff);
          if (typeof their === 'undefined' || typeof their === 0){
            their = 'None';
            diff = 'none';
            desc = 'N/a';
          }
          matches.push({
            their : their,
            your : your,
            beerName : name,
            diff : diff,
            desc : desc,
            checkin : checkin
            /*username : checkin.user.user_name,
            firstName : checkin.user.first_name,
            lastName : checkin.user.last_name,
            from : checkin.user.location,
            bio : checkin.user.bio,*/
          })
        }else{
          nearby.push({
            their : their,
            beerName : name,
            checkin : checkin
          });
        }
      });
      return cb(null, { matches : matches, nearby : nearby });
    });
    
  });  
};
