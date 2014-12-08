var cache = require('memory-cache');
var _ = require('underscore');
// Making async to make dropping in redis in future easier

exports.get = function(key, cb){  
  if (!key){
    return cb();
  }
  var cacheRes = cache.get(key);
  if (!cacheRes){
    return cb();
  }
  return cb(null, cache.get(key));
}

exports.set = function(key, val, expire, cb){
  cache.put(key, _.clone(val), expire);
  return cb(null, true);
}


exports.EXPIRES = 86400000; // 1 day in ms
exports.EXPIRES_SHORT = 900000; // 15 mins in ms
