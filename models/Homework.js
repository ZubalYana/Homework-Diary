const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  // subject: { type: String, required: true },
  homework: { type: String, required: true }
});

const daySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  lessons: [lessonSchema]
});

const homeworkSchema = new mongoose.Schema({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema
});

const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = Homework;
