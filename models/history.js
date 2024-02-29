const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    muscle: {
        type: String,
        required: true
    },
    exercises: {
        type: Array,
        required: true
    }
});

const History = mongoose.model('History', historySchema);

module.exports = History;