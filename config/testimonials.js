var circle = 'data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
title = require('./config').title;
var testimonials = [
  {
    name : 'George W. Bush',
    text : 'As a disgraced president, it was difficult to find my true BeerMate. As well as painting naked selfies &amp; invading oil-laden countries, I like nothing better than to relax with a fine nano-brewed Bud Lite',
    image : 'gwb.png'
  },
  {
    name : 'Joseph Kony',
    text : 'Being an ousted warlord, finding love can be tough. ' + title + ' allows me to find true BeerMance without having to leave my hiding-cave.',
    image : 'jk.png'
  },
  {
    name : 'Sarah Palin',
    text : title + ' allowed me to connect with my constituents in the depths of winter the only way Alaskans know how - drinking.',
    image : 'sp.png'
  },
  {
    name : 'Peado Bear',
    text : 'As a registered sex offender, I can\'t often visit bars. ' + title + ' allowed me to find my latest victims, er, soulmate - from the comfort of my basement, er, living room',
    image : 'pb.png'
  }
];
module.exports = function(){
  return testimonials.slice(0, 3);
};
