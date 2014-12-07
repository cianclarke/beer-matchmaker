$(function(){  
  var located = false;
  $('select').change(function(e){
    var val = $(this).val();
    if (val === 'other'){
      $(this).parent().next('.other').show();
      $(this).parent().next('.other').find('input').val('');
    }else{
      $(this).parent().next('.other').hide();
      $(this).parent().next('.other').find('input').val(val);
    }
  });
  // Trigger the change event on first load
  $('select').trigger('change');
  $('button').on('click', function(){
    $('button span').html('Loading...')
    setTimeout(function(){
      $('button').attr('disabled', true)  
    }, 250);
  });
  
  var nearbyBtn = $('button.btn-nearby');
  nearbyBtn.attr('disabled', true);
  nearbyBtn.find('span').html('Loading your location');
  
  $('.tab-nearby').click(function(){
    if (!located){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          $('input[name=lat]').val(position.coords.latitude);
          $('input[name=long]').val(position.coords.longitude);
          nearbyBtn.attr('disabled', false);
          nearbyBtn.find('span').html('Find matches near me!');
          located = true;
        });
      }else{
        nearbyBtn.html('Your browser does not support geolocation!');
        located = true;
      }
    }
  });
});
