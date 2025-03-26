const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },    
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    OTP: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    }
});

module.exports = mongoose.model('User', UserSchema);
