$(".registerButton").click(function(){
    var div = $(this).prev().prev();
    div.slideUp();
    $(this).fadeToggle();
    $(this).next().delay(400).slideDown();
});

$(".signInButton").click(function(e){
	e.preventDefault();
	window.location = '/main';
});