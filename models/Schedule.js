const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    monday: [{ subject: String }],
    tuesday: [{ subject: String }],
    wednesday: [{ subject: String }],
    thursday: [{ subject: String }],
    friday: [{ subject: String }],
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
module.exports = Schedule;
