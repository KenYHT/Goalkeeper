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
	var goalDeadline = validator.escape(req.body.date);
	var goalTime = validator.escape(req.body.time);
	var goalTimeOfDay = validator.escape(req.body.timeOfDay);
	var goalTags = req.body.tags || [];
	var goalDate = parseDate(goalDeadline, goalTime, goalTimeOfDay);
	console.log(goalDate);
	if (goalTags) {
		for (var i = 0; i < goalTags.length; i++)
			goalTags[i] = validator.escape(goalTags[i]);	
	}

	Goal.findOneAndUpdate({ user: req.session.user, title: goalName }, // find the goal with the user and goal title
		{ title: goalName, user : req.session.user, description: goalDescription, date: goalDate, tags: goalTags }, // save all the respective information
		{ upsert: true },
		function (err, goal) {
			if (err)
				res.send({ status: "Error", message: err });

			res.send({ status: "OK", message: "Saved." });
		}
	);
}

/**
* Creates a new Date object given the date, time, and time of day.
*/
function parseDate(date, time, timeOfDay) {
	var deadlineDate = date.split('/');
	var deadlineTime = time.split(':');
	var hour = parseInt(deadlineTime[0]);
	var minutes = parseInt(deadlineTime[1]);
	
	for (var i = 0; i < deadlineDate.length; i++)
		deadlineDate[i] = parseInt(deadlineDate[i]);

	if (timeOfDay === "AM")
		hour = hour % 12;
	else 
		hour = (hour % 12) + 12;

	var resultDate = new Date(deadlineDate[2], deadlineDate[0] - 1, deadlineDate[1], hour, minutes, 0, 0);
	return resultDate.getTime();
}