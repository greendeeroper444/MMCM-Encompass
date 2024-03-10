const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: String,
    name: { 
        type: String, 
        required: true 
    },
    email:  { 
        type: String, 
        required: true 
    },
    image: String,
    
})


const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
