// Define a MongoDB Schema for Search History
const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    activity: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);


