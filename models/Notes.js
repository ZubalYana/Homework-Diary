const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    files: [{ type: String }] 
});

module.exports = mongoose.model('Notes', NotesSchema);
