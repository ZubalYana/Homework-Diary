const mongoose = require('mongoose');

const homeworkScheme = new mongoose.Schema({
    homework: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    }
});

const homework = mongoose.model('homework', homeworkScheme);
module.exports = homework;
