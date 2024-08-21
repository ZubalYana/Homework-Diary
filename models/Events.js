const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    details: { type: String }
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
module.exports = Schedule;
