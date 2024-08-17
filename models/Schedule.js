const mongoose = require('mongoose');

const schedueSchema = new mongoose.Schema({
    subject: { type: String, required: true },
});

const dayScheduleSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    subjects: [schedueSchema]
});

const schedule = new mongoose.Schema({
    monday: dayScheduleSchema,
    tuesday: dayScheduleSchema,
    wednesday: dayScheduleSchema,
    thursday: dayScheduleSchema,
    friday: dayScheduleSchema
});