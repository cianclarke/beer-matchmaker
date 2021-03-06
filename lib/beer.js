var UntappdClient = require("node-untappd"),
config = require('../config/config'),
cache = require('./cache');

exports.distinct = function(token, user, sort, offset, cb){
  var cacheKey = user + '-' + sort + '-' + offset;
  if (config.instrumentation) console.time(cacheKey);
  
  cache.get(cacheKey, function(err, res){
    if (!err && typeof res !== 'undefined'){
      if (config.instrumentation) console.timeEnd(cacheKey);
      return cb(null, res);
    }
    
    var untappd = new UntappdClient(false);
    untappd.setAccessToken(token);
    untappd.setClientId(config.clientId);
    untappd.userDistinctBeers(function(err, distinctResponse){
      if (config.instrumentation) console.timeEnd(cacheKey);
      if (err){
        return cb(err);
      }
      var beers = distinctResponse && distinctResponse.response && distinctResponse.response.beers && distinctResponse.response.beers.items || undefined;
      if (typeof beers === 'undefined'){
        return cb('Error retrieving beers for user ' + user + ' with offset ' + offset + '\n' + JSON.stringify(distinctResponse));
      }
      cache.set(cacheKey, beers, cache.EXPIRES, function(){});
      return cb(null, beers);
    }, user, sort, offset);
  });
}

exports.nearby = function(token, lat, long, radius, offset, cb){
  var cacheKey = lat + '-' + long + '-' + radius + '-' + offset;
  cache.get(cacheKey, function(err, res){
    if (!err && typeof res !== 'undefined'){
      return cb(null, res);
    }
    var untappd = new UntappdClient(false);
    untappd.setAccessToken(token);
    untappd.setClientId(config.clientId);
    untappd.pubFeed(function(err, pubResponse){
      if (err){
        return cb(err);
      }
      var checkins = pubResponse && pubResponse.response && pubResponse.response.checkins && pubResponse.response.checkins.items || undefined;
      if (typeof checkins === 'undefined'){
        return cb('Error retrieving checkins' + '\n' + JSON.stringify(pubResponse));
      }
      cache.set(cacheKey, checkins, cache.EXPIRES_SHORT, function(){});
      return cb(null, checkins);
    }, undefined, lat, long, radius, undefined, offset);
  });
};
