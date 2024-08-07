const mongoose = require('mongoose');

const mondayHomework = new mongoose.Schema({
    homework: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
});

const monday = mongoose.model('mondayHomework', homeworkSchema);
module.exports = mondayHomework;
