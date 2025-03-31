const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
