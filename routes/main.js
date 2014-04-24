// Renders the main webapp page
exports.index = function(req, res) {
	res.render('main');	
};


var ObjectId = require('mongoose').Types.ObjectId;
var Goal = require('./../models/goal-model.js').Goal;
var validator = require('validator');


// Handles POST requests to create/update goals
exports.saveGoal = function (req, res) {

	var goalName = validator.escape(req.body.name);
	var goalDescription = validator.escape(req.body.description);
	var goalDeadline = validator.escape(req.body.deadline);

	Goal.findOneAndUpdate({ title: goalName },
		{ description: goalDescription, deadline: goalDeadline },
		{ upsert: true },
		function (err, goal) {
			if (err){
				res.send({ status: "Error", message: err });
			}

			res.send({ status: "OK", message: "Saved." });
		}
	);

}