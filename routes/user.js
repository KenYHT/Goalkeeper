var mongoose = require('mongoose');
var User = mongoose.model('User');
var validator = require('validator');

exports.register = function (req, res){
	var userEmail = validator.escape(req.body.email); 
	var userPassword = validator.escape(req.body.password);
	var userVerifyPassword = validator.escape(req.body.verifyPassword);
	var errors = validateRegistration(userEmail, userPassword, userVerifyPassword);

	User.findOne({ email : userEmail }, 
		function(err, data) {
			if (data !== null)
				errors.push("This email has already been registered.");
			
			if (errors.length === 0) {
				var user = new User({
					email : req.body.email,
					password : req.body.password
				});

				user.save(function(err){
					console.log(err);
					res.send({ errorMessages : "Could not be registered."});
				});

				res.send({ redirect: "/" });
			} else {
				res.send({ errorMessages : errors});
			}
	});
};

function validateRegistration(email, password, verifyPassword) {
	var validatorCommands = [
								[function() {
									return validator.isEmail(email);
								}, "You've provided an invalid email."],
								[function() {
									return validator.equals(password, verifyPassword);
								}, "Your passwords don't match."],
								[function() {
									return validator.isAlphanumeric(password);
								}, "Your password must contain only letters and numbers."],
								[function() {
									return validator.isLength(password, 6, 32);
								}, "Your password must be between 6 and 32 characters long."]
							];
	var errors = [];

	for (var i = 0; i < validatorCommands.length; i++) {
		if (!validatorCommands[i][0]())
			errors.push(validatorCommands[i][1]);
	}

	return errors;
}


exports.login = function (req, res){
	var cookieTime = 1000 * 60 * 60 * 24 * 30; // keep a cookie for 30 days
	var minute = 1000 * 60; // keep a cookie for a minute
	var userEmail = validator.escape(req.body.email);
	var userPassword = validator.escape(req.body.password);

  	User.getAuthenticated(userEmail, userPassword, function(err, user, reason) {
        if (err){
          console.log(err);
        }

        // login was successful if we have a user
        if (user) {
        	req.session.user = userEmail;

        	if (req.body.remember)
        		res.cookie('remember', 1, { maxAge : cookieTime }); // have the cookie last 30 days if the user wants to be remembered
        	else
        		res.cookie('remember', 1, { maxAge : minute }); // have the cookie last a minute if the user does not want to be remembered

            res.send({ redirect: "/" });
            return;
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            	res.send({err: "The username or password is incorrect."})
            	break;
            case reasons.PASSWORD_INCORRECT:
              	res.send({err: "The username or password is incorrect."})
              	break;
            case reasons.MAX_ATTEMPTS:
            	res.send({err: "Max attempts reached."})
            	// send email or otherwise notify user that account is
                // temporarily locked
                break;
        }
    });
};

exports.logout = function(req, res) {
	res.clearCookie('remember'); // clear the cookie
	req.session = null; // kill the session
	res.redirect('/');
}