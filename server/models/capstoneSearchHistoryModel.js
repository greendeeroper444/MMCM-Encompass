const mongoose = require('mongoose');

const CapstoneSearchHistorySchema = new mongoose.Schema({
    query: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['Admin', 'User'],
        required: true
    },
    authId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const CapstoneSearchHistoryModel = mongoose.model('SearchHistory', CapstoneSearchHistorySchema);

module.exports = CapstoneSearchHistoryModel;
