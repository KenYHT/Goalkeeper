$(".registerButton").click(function(){
    var div = $(this).prev().prev();
    div.slideUp();
    $(this).fadeToggle();
    $(this).next().fadeToggle();
});