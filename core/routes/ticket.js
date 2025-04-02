// load modules

const express = require('express');
const mongoose = require('mongoose');
const passport = require('../middlewares/passport');
const bodyHandler = require('../handlers/bodyHandler');
const Ticket = require('../models/ticket');
const Event = require('../models/event');
const User = require('../models/user');
const OTP = require('../models/otp');


const {sendEmail} = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false });

// Get user tickets
router.get('/user/:userId', requireAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const tickets = await Ticket.find({ userId }).populate('eventId', 'name date location description capacity tags images attendees');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all tickets for an event
router.get('/event/:eventId', requireAuth, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const tickets = await Ticket.find({ eventId }).populate('userId', 'firstName lastName email phoneNumber role');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;