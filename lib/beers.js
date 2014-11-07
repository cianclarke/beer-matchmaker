var async = require('async');
var _ = require('underscore');
var UntappdClient = require("node-untappd");

exports.getUserCheckins = function(token, user, cb){
  
  var untappd = new UntappdClient(false);
  untappd.setAccessToken(token);

  untappd.userInfo(function(err, userInfo){
    if (err){
      return cb(err);
    }
    
    if (!userInfo.response || !userInfo.response.user){
      console.log(userInfo);
      return cb('Untappd response was missing user info - some error occured');
    }
    
    var totalCheckins = userInfo.response.user.stats.total_beers, 
    totalUnique = userInfo.response.user.stats.total_beers,
    ourUserInfo = _.pick(userInfo.response.user, 'user_name', 'first_name', 'last_name', 'location', 'bio', 'user_avatar'),
    offset = 0,
    offsetIncrement = 25,
    getters = [];
    
    ourUserInfo.total_beers = totalCheckins;
    
    while (offset < totalUnique){
      (function(user, offset){
        getters.push(
          function(asyncCb){
            untappd.userDistinctBeers(asyncCb, user, 'date', offset);  
          }
        );
      })(user, offset);
      offset += offsetIncrement;
    }
    
    var gettersFiltered;
    if (getters.length > 1){
      gettersFiltered = [getters[0], getters[1]];
    }else{
      gettersFiltered = [getters[0]];
    }
    
    // TODO: Open this bad boy up..
    async.parallel(gettersFiltered, function(err, combinedRes){
      if (err){
        return cb(err);
      }
      var combinedResWithoutFluff = _.map(combinedRes, function(item){
        var safeGet = item && item.response && item.response.beers && item.response.beers.items || [];
        return safeGet;
      });
      combinedResWithoutFluff = _.flatten(combinedResWithoutFluff);
      return cb(err, { user : ourUserInfo, beers : combinedResWithoutFluff});
    });
  }, user);
}

exports.analyseUserCheckins = function(userInfo, cb){
  var userCheckins = userInfo.beers,
  styles = {},
  beers = {};
  _.each(userCheckins, function(checkin){
    var name = checkin.brewery.brewery_name + ' - ' + checkin.beer.beer_name,
    style = checkin.beer.beer_style,
    rating = checkin.rating_score;
    
    if (typeof rating !== 'number'){
      return;
    }
    if (!styles.hasOwnProperty(style)){
      styles[style] = [];
    }
    
    styles[style].push(rating);
    beers[name] = rating;
  });
  
  // Average up all the sums
  _.each(styles, function(averages, key){
    var sum = _.reduce(averages, function(a, b){ return a + b; }),
    average = sum / averages.length;
    styles[key] = average;
  });
  
  return cb(null, { styles : styles, beers : beers, user : userInfo.user});
}

exports.getUserCheckinsAndAnalyse = function(token, user, cb){
  exports.getUserCheckins(token, user, function(err, userCheckinsRes){
    if (err){
      return cb(err);
    }
    exports.analyseUserCheckins(userCheckinsRes, cb);
  });
}

var _diff = function(a, b){
  return Math.abs(a-b);
};

var _describe = function(diff){
  var desc;
  diff = Math.round(diff);
  switch(diff){
    case 0:
      desc = 'Completely agree';
      break;
    case 1:
      desc = 'Strongly agree';
      break;
    case 2:
      desc = 'Disagree';
      break;
    case 3:
      desc = 'Strongly Disagree';
      break;
    case 4:
      desc = 'Completely Disagree';
      break;
    case 5:
    default:
      desc = 'are Polar Opposites';
      break;
  }
  return desc;
}

exports.compareUsers = function(token, userA, userB, cb){
  async.parallel({
    a : function(cb){
      exports.getUserCheckinsAndAnalyse(token, userA, cb);
    },
    b : function(cb){
      exports.getUserCheckinsAndAnalyse(token, userB, cb);
    }
  }, function(err, combinedUserRes){
    if (err){
      return cb(err);
    }
    
    var a = combinedUserRes.a,
    b = combinedUserRes.b,
    stylesInCommon = {},
    beersInCommon = {};
    
    _.each(a.styles, function(ratingAGave, style){
      if (b.styles.hasOwnProperty(style)){
        var ratingBGave = b.styles[style],
        diff = _diff(ratingAGave, ratingBGave);
        stylesInCommon[style] = {};
        stylesInCommon[style].a = ratingAGave;
        stylesInCommon[style].b = ratingBGave;
        stylesInCommon[style].diff = diff;
        stylesInCommon[style].desc = _describe(diff);
      }
    });
    
    _.each(a.beers, function(ratingAGave, beer){
      if (b.beers.hasOwnProperty(beer)){
        var ratingBGave = b.beers[beer],
        diff = _diff(ratingAGave, ratingBGave);
        beersInCommon[beer] = {};
        beersInCommon[beer].a = ratingAGave;
        beersInCommon[beer].b = ratingBGave;
        beersInCommon[beer].diff = diff;
        beersInCommon[beer].desc = _describe(diff);
      }
    });
    
    console.log('sic');
    console.log(stylesInCommon);
    console.log('bic');
    console.log(beersInCommon);
    
    var totalStyleDifference = _.pluck(_.values(stylesInCommon), 'diff'),
    averageStyleDifference = _.reduce(totalStyleDifference, function(a, b){ return a + b; }) / totalStyleDifference.length;
    
    var totalBeerDifference = _.pluck(_.values(beersInCommon), 'diff'),
    averageBeerDifference = _.reduce(totalBeerDifference, function(a, b){ return a + b; }) / totalBeerDifference.length;
    
    var totalDifferenceOutOfTen = (averageStyleDifference + averageBeerDifference),
    match;
    // average the totals & round the number..
    if (Math.round(totalDifferenceOutOfTen) / 2 <=1){
      match = true;
    }else{
      match = false;
    }
    
    return cb(null, {
      beersInCommon : beersInCommon,
      stylesInCommon : stylesInCommon, 
      averageBeerDifference : averageBeerDifference, 
      averageStyleDifference : averageStyleDifference, 
      styleDesc : _describe(averageStyleDifference), 
      beerDesc : _describe(averageBeerDifference),
      match : match,
      // totalDifferenceOutOfTen is the % by which the users differ. To get their similarity, invert the %
      percent : Math.abs(Math.round(totalDifferenceOutOfTen * 10) - 100),
      a : a.user,
      b : b.user
    });
  });
}
