$(".registerButton").click(function(){
    var div = $("#submit_form");
    div.slideUp();
    $(this).fadeToggle();
    $("#register_form").delay(300).slideDown();
    $("#error_message").fadeOut();
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
    console.log($(this).attr('action'))


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
    		$("#error_message").fadeIn().text(data.err)
    	}

        console.log(data)
    }

    return false;

});