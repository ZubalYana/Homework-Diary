const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    // startTime: { type: String, required: true },
    // endTime: { type: String, required: true } 
});

const dayScheduleSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true, index: true },
    subjects: [scheduleSchema]
});

const weekScheduleSchema = new mongoose.Schema({
    days: [dayScheduleSchema]
});
