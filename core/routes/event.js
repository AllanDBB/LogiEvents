// Load modules
const express = require('express');
const passport = require('../middlewares/passport');
const Event = require('../models/event');
const User = require('../models/user');
const Media = require('../models/media');
const upload = require('../middlewares/multer');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bodyHandler = require('../handlers/bodyHandler');
const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });
const Ticket = require('../models/ticket');
const OTP = require('../models/otp');
const { sendAdminCode, sendVerificationCode } = require('../services/smsService');
const { sendEmail } = require('../services/emailService');

// Create an event
router.post('/', requireAuth,  async (req, res) => {
    try {
        const { name, date, hour, location, description, price, capacity, category, img } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.role !== 'admin') return res.status(403).json({ error: 'You do not have permission to create an event' });

        const dateParts = date.split('/');
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        const dateObj = new Date(formattedDate);
        if (isNaN(dateObj.getTime())) return res.status(400).json({ error: 'Invalid date format' });

        const event = new Event({
            name,
            date: dateObj.toISOString().split('T')[0],
            hour,
            location,
            description,
            price: parseFloat(price),
            capacity: parseInt(capacity),
            category,
            status: 'activo',
            createdBy: user._id,
            image: img,
            availableSpots: parseInt(capacity),
        });

        const savedEvent = await event.save();
        console.log('✅ Evento creado:', savedEvent);

        res.status(201).json(savedEvent);
    } catch (error) {
        console.error("❌ ERROR COMPLETO ===>", error);
        res.status(400).json({ error: error.message, full: error });
    }
});


// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('attendees', 'firstName lastName email phoneNumber role');

        // Format the date to dd/mm/yyyy
        const formattedEvents = events.map(event => {
            const eventObj = event.toObject();
            
            if (eventObj.date instanceof Date) {
                const dateString = eventObj.date.toISOString().split('T')[0]; 
                const dateParts = dateString.split('-');
                eventObj.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; 
            } else if (typeof eventObj.date === 'string' && eventObj.date.includes('-')) {
                const dateParts = eventObj.date.split('-');
                eventObj.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
            
            return eventObj;
        });

        res.status(200).json(formattedEvents);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all events by user.
router.get('/user/:userId', requireAuth, async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let events;
        if (user.role === 'admin') {
            events = await Event.find({ createdBy: userId });
        } else {
            events = await Event.find({ attendees: userId });
        }

        const formattedEvents = events.map(event => {

            const eventObj = event.toObject();
            
            if (eventObj.date instanceof Date) {
                const dateString = eventObj.date.toISOString().split('T')[0]; 
                const dateParts = dateString.split('-');
                eventObj.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; 
            } else if (typeof eventObj.date === 'string' && eventObj.date.includes('-')) {

                const dateParts = eventObj.date.split('-');
                eventObj.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
            
            return eventObj;
        });
        
        res.status(200).json(formattedEvents);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single event by ID
router.get('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const eventObj = event.toObject();

        if (eventObj.date instanceof Date) {
            const dateString = eventObj.date.toISOString().split('T')[0];
            const dateParts = dateString.split('-');
            eventObj.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        } else if (typeof eventObj.date === 'string' && eventObj.date.includes('-')) {
            const dateParts = eventObj.date.split('-');
            eventObj.date = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }

        res.status(200).json(eventObj);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update an event by ID
router.put('/:eventId', requireAuth, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to update this event' });
        }

        const event = await Event.findByIdAndUpdate(eventId, req.body, { new: true });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an event by ID
router.delete('/:eventId', requireAuth, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to delete this event' });
        }

        // Create a OTP code for the deletion
        const OTPCode = crypto.randomInt(100000, 999999);
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const newOTP = new OTP({
            code: OTPCode,
            userId: user._id,
            expiresAt
        });

        await newOTP.save();
        await sendAdminCode(user.phoneNumber, newOTP.code);

        await newOTP.save();

        // Send mail to now the user
        const mailOptions = {
            to: user.email,
            subject: 'Event Deletion OTP',
            text: `Your OTP code for event deletion is ${OTPCode}. It will expire in 15 minutes.`
        };
        await sendEmail(mailOptions);

        res.status(200).json({ message: 'Verification codes sent, please confirm to proceed.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Confirm deletion of an event
router.post('/:eventId/confirm-delete', requireAuth, async (req, res) => {

    try {
        const { code } = req.body;
        const eventId = req.params.eventId;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = await OTP.findOne({ userId: user._id, code, used: false });

        if (!otp) {
            return res.status(400).json({ error: 'Invalid OTP code' });
        }

        // Mark the OTP as used
        otp.used = true;
        await otp.save();

        // Delete the event
        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error("❌ ERROR COMPLETO ===>", error);
        res.status(400).json({ error: error.message });
    }
});

// Reserve a ticket for an event
router.post('/:eventId/reserve', requireAuth, async (req, res) => {
    try {
        const { phoneNumber, quantity } = req.body;
        const eventId = req.params.eventId;

        const user = await User.findById(req.user._id);

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.attendees.length + quantity > event.capacity) {
            return res.status(400).json({ error: 'Not enough spots available' });
        }

        // Generate OTP with 6 random uppercase letters
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let OTPCode = '';
        for (let i = 0; i < 6; i++) {
            OTPCode += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const newOTP = new OTP({
            userId: req.user._id,
            code: OTPCode,
            expiresAt
        });

        await newOTP.save();
        await sendVerificationCode(phoneNumber, OTPCode);

        res.status(200).json({ message: 'Verification code sent. Please confirm your reservation.' });
    } catch (error) {
        console.error("❌ ERROR COMPLETO ===>", error);
        res.status(400).json({ error: error.message });
    }
});

// Confirm reservation
router.post('/:eventId/confirm-reservation', requireAuth, async (req, res) => {
    try {
        const { phoneNumber, code, fullName, email, quantity } = req.body;
        const eventId = req.params.eventId;

        const user = await User.findById(req.user._id);

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const otp = await OTP.findOne({ userId: user._id, code, used: false });
        if (!otp) {
            return res.status(400).json({ error: 'Invalid OTP code' });
        }
        
        otp.used = true;
        await otp.save();

        // create tickets
        const ticket = new Ticket({
            eventId: event._id,
            userId: user._id,
            ticketPrice: event.price,
            ticketType: 'general',
            ticketStatus: 'active',
            ticketQuantity: quantity,
        });

        await ticket.save();

        event.attendees.push(user._id);

        event.availableSpots -= quantity;

        await event.save();

        await sendEmail({
            to: email,
            subject: 'Reservation Confirmation',
            text: `You have successfully reserved ${quantity} ticket(s) for the event: ${event.name}.`
        });

        res.status(200).json({ message: 'Reservation confirmed' });
    } catch (error) {
        console.error("❌ ERROR COMPLETO ===>", error);
        res.status(400).json({ error: error.message });
    }
});


// Unattend an event
router.post('/:eventId/unattend', requireAuth, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.user._id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (!event.attendees.includes(userId)) {
            return res.status(400).json({ error: 'You are not attending this event' });
        }

        event.attendees.pull(userId);
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all events for a user
router.get('/user/:userId', requireAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const events = await Event.find({ attendees: userId }).populate('attendees', 'firstName lastName email phoneNumber role');
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;