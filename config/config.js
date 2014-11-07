module.exports = {
  title : 'Untappd Matchmaker',
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  redirectUrl : function(){
    return 'https://untappd.com/oauth/authenticate/?client_id=' + this.clientId + '&response_type=code&redirect_url=http://' + this.host + ':' + this.port +'/oauth/callback';
  },
  instrumentation : true,
  host : '127.0.0.1',
  port : 3000
};
