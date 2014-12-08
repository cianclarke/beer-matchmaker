module.exports = {
  title : 'Beer Matchmaker',
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET,
  instrumentation : true,
  host : process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  port : process.env.OPENSHIFT_NODEJS_PORT || 3000,
  publicHost : (typeof process.env.OPENSHIFT_NODEJS_IP === 'undefined') ?  'http://127.0.0.1' : 'http://beermatchmaker-cianclarke.rhcloud.com',
  publicPort : (typeof process.env.OPENSHIFT_NODEJS_PORT === 'undefined') ?  '3000' : '80',
  mode : (process.env.OPENSHIFT_NODEJS_IP === 'undefined') ? 'dev' : 'production',
  redirectUrl : function(){
    return 'https://untappd.com/oauth/authenticate/?client_id=' + this.clientId + '&response_type=code&redirect_url=' + this.publicHost + ':' + this.publicPort +'/oauth/callback';
  },
  footer : function(){
    return "Created by <a href=\"http://www.cianclarke.com\">Cian Clarke</a> &amp; in no way affiliated with Untappd. " +
    " Report bugs <a href=\"https://github.com/cianclarke/beer-matchmaker/issues\">on GitHub</a>.<br />" +
    "<span class=\"nomobile\">Requires access to your Untappd Account.We won't do anything nasty like post to your feed, or recommend an AA meeting - promise.</span>";
    
  }
};
