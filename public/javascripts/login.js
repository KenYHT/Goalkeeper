$(".registerButton").click(function(){
    var div = $("#submit_form");
    div.slideUp();
    $(this).fadeToggle();
    $("#register_form").delay(300).slideDown();
    $("#error_container").fadeOut();
});

$("#submit_form").submit(function(e){
	e.preventDefault();

    $.ajax({
        url     : $(this).attr('action'),
        type    : $(this).attr('method'),
        dataType: 'json',
        data    : $(this).serialize(),
        success : onLoginSuccess,
        error   : onLoginFailure,
        timeout : 3000
    });

    function onLoginFailure(err){
    	console.log("Failure")
        console.log(err)
    }

    function onLoginSuccess(data) {
    	console.log("Success!")
    	if (data.redirect) {
    		window.location = data.redirect;
    	}
    	else {
            $("#error_container").hide().fadeIn()
    		$("#error_message").hide().fadeIn().text(data.err)
    	}
    }

    return false;
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

	function onSubmitSuccess(data) {
		if (data.redirect) {
			window.location = data.redirect;
		} else {
			var errors = "";
			for (var i = 0; i < data.errorMessages.length; i++) {
				errors += data.errorMessages[i] + "\n";
				console.log(data.errorMessages[i]);
			}

            $("#error_container").hide().fadeIn()
			$("#error_message").fadeIn().text(errors);
		}
	}

	function onSubmitError(err) {
		console.log(errors);
		console.log("Failure");
	}
});