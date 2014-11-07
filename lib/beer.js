var UntappdClient = require("node-untappd");
var cache = require('./cache');

exports.distinct = function(token, user, sort, offset, cb){
  var cacheKey = user + '-' + sort + '-' + offset;
  
  cache.get(cacheKey, function(err, res){
    if (!err && typeof res !== 'undefined'){
      console.log('got from cache: ' + cacheKey);
      return cb(null, res);
    }
    
    var untappd = new UntappdClient(false);
    untappd.setAccessToken(token);
    untappd.userDistinctBeers(function(err, distinctResponse){
      if (err){
        return cb(err);
      }
      var beers = distinctResponse && distinctResponse.response && distinctResponse.response.beers && distinctResponse.response.beers.items || undefined;
      if (!beers){
        return cb('Error retrieving beers for user ' + user + ' with offset ' + offset);
      }
      cache.set(cacheKey, beers, cache.EXPIRES, function(){});
      return cb(null, beers);
    }, user, sort, offset);
  });
}
