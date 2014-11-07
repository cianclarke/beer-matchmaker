$(function(){  
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
});
