// Load modules

const express = require('express');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('../middlewares/passport');

// Router
const router = express.Router();

// Import models
const User = require('../models/user');
const OTP = require('../models/otp');
const Conversation = require('../models/conversation');
const Message = require('../models/message');


// Import handlers
const bodyHandler = require('../handlers/bodyHandler');

// Start a conversation with chatbot
router.post('/start', async (req, res) => {
    try {
        const { userId } = req.body;
        const conversation = await Conversation.create({ userId });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Send a message to the chatbot
router.post('/send', async (req, res) => {
    try {
        const { conversationId, senderId, text } = req.body;

        // analyze the message and get a response
        const response = await analyzeMessage(text);
        const message = await Message.create({
            conversationId,
            sender: 'user',
            text: text
        });

        // save the message to the database
        await message.save();

        const botMessage = await Message.create({
            conversationId,
            sender: 'system',
            text: response
        });

        await botMessage.save();

        // Add message to conversation
        const conversation = await Conversation.findById(conversationId);
        conversation.messages.push(message._id);
        conversation.messages.push(botMessage._id);
        await conversation.save();
        
        res.status(200).json({ message: botMessage });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// create "analyzeMessage" function to analyze the message and get a response
const analyzeMessage = async (message) => {
    // This is where you would implement your chatbot logic
    // For now, we'll just return a simple response
    return `You said: ${message}`;
};

module.exports = router;