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
    
});

module.exports = mongoose.model('User', UserSchema);
