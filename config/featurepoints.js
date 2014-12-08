var circle = 'data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
title = require('./config').title;
var features = [
  {
    name : 'Compare Common Beers',
    text : 'You\'ve checked in hundreds (perhaps thousands) of beers. Instead of admitting you have a problem, why not compare what beers you have in common with friends?',
    image : 'bic.png'
  },
  {
    name : 'Match styles & countries',
    text : 'No beers in common? The romance isn\'t dead in the water just quite yet. We can compare styles of beer & common producing countries you have both checked in to see how compatible you are with your match',
    image : 'sic.png'
  },
  {
    name : 'Find drinkers near you!',
    text : 'Not only can you match with your friends list - you can try a match on beer drinkers who have checked in near you. "I see you like PBR? I like PBR too!". Creepy? Nah..',
    image : 'nearby.png'
  }
];
module.exports = function(){
  return features.slice(0, 3);
};
