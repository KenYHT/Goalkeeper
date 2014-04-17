$(".registerButton").click(function(){
    var div = $(this).prev().prev();
    div.slideUp();
    $(this).fadeToggle();
    $(this).next().delay(300).slideDown();
});

$(".signInButton").click(function(e){
	
/*	e.preventDefault();
	window.location = '/main';*/
});

$("#register_form").submit(function(event) {
	event.preventDefault();
	
	$.ajax({
		url      : $(this).attr('action'),
		type     : $(this).attr('method'),
		data     : $(this).serialize(),
		success  : onSubmitSuccess,
		error    : onSubmitError,
		timeout  : 3000
    });

	function onSubmitSuccess(errors) {
		console.log(errors);
		console.log("asdflakdf");
	}

	function onSubmitError(errors) {
		console.log(errors);
		console.log("error");
	}
});