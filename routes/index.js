/*
 * GET home page.
 */
var mongoose = require('mongoose');
var Goal = mongoose.model('Goal');

exports.index = function(req, res){
	if (req.cookies.remember) {
		// find the user's goals
		Goal.find({ user: req.session.user }, 
			function(err, data) {
				if (err)
					res.send("Error: " + err);
				else {
					console.log(data);
					res.render('main', { goals: data, user: req.session.user }); // render the main page with the users goals
				}
			}
		);
	}
	else
		res.render('index', { title: 'Goalkeeper'});
};
