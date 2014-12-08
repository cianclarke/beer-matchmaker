exports.diff = function(a, b){
  return Math.abs(a-b);
};

exports.describe = function(diff){
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
