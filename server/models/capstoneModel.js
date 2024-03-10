const mongoose = require('mongoose');

const CapstoneSchema = new mongoose.Schema({
    title: String,
    description:String,
    author: String,
    pdf: String,
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
});

const CapstoneModel = mongoose.model('Capstone', CapstoneSchema);

module.exports = CapstoneModel;
