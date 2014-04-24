// Renders the main webapp page
exports.index = function(req, res) {
	res.render('main');	
};

var ObjectId = require('mongoose').Types.ObjectId;
var Goal = require('./../models/goal-model.js').Goal;
var validator = require('validator');

// Handles POST requests to create/update goals
/**
* POST request for saving/updating a goal. Sanitizes the form input, then 
*/
exports.saveGoal = function (req, res) {
	var goalName = validator.escape(req.body.title);
	var goalDescription = validator.escape(req.body.description);
	var goalDeadline = validator.escape(req.body.deadline);
	var goalTags = req.body.tags || [];

	if (goalTags) {
		for (var i = 0; i < goalTags.length; i++)
			goalTags[i] = validator.escape(goalTags[i]);
	}

	Goal.findOneAndUpdate({ user: req.session.user, title: goalName },
		{ title: goalName, user : req.session.user, description: goalDescription, deadline: goalDeadline, tags: goalTags },
		{ upsert: true },
		function (err, goal) {
			if (err){
				res.send({ status: "Error", message: err });
			}

			res.send({ status: "OK", message: "Saved." });
		}
	);

}