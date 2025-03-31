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
    phoneNumber: {
        type: String,
        required: true
    },
    businessID: {
        type: String,
        required: false
    },
    DNI: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
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
    },
    profilePicture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: false
    },
});

module.exports = mongoose.model('User', UserSchema);