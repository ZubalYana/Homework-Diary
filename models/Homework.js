const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
    homework: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
});

const Homework = mongoose.model('Homework', homeworkSchema);
module.exports = Homework;
