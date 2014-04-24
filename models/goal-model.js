var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GoalSchema = new Schema({
    user: { type: String, required: true },     // should be REQUIRED
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String },         // Probably should be a date
    priority: { type: Number },
});

// Export the Goal Schema
exports.Goal = mongoose.model('Goal', GoalSchema);