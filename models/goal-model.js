var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GoalSchema = new Schema({
    user : { type: String, required: true },     // should be REQUIRED
    title : { type: String, required: true },
    description: { type: String },
    date : { type: Number },         // Probably should be a date
    priority : { type: Number },
    tags : [ String ]
});

// Export the Goal Schema
exports.Goal = mongoose.model('Goal', GoalSchema);