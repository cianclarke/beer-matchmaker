var config = require('../config/config.js')
module.exports = function(res, message, error){
  if (typeof error === 'object' 
    && error.hasOwnProperty('meta') 
    && error.meta.hasOwnProperty('error_type')
    && error.meta.error_type === 'invalid_token'){
      return res.redirect(config.redirectUrl());
    }
  return res.render('error', {
      message: message,
      error: error
  });
}
