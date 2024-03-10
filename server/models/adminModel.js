const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String
})

const AdminModel = mongoose.model('Admin', AdminSchema);
module.exports = AdminModel;