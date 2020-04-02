  //owl carousel

  $(document).ready(function() {
    $("#owl-demo").owlCarousel({
        navigation : true,
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem : true,
  autoPlay:true

    });
});

//custom select box

$(function(){
    $('select.styled').customSelect();
});