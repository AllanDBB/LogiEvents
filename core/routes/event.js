// Load modules
const express = require('express');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const passport = require('../middlewares/passport');
const bodyHandler = require('../handlers/bodyHandler');
const Event = require('../models/event');
const User = require('../models/user');
const Ticket = require('../models/ticket');
const OTP = require('../models/otp');
const Media = require('../models/media');
const upload = require('../middlewares/multer');

const router = express.Router();

const requireAuth = passport.authenticate('jwt', { session: false });
const { sendAdminCode, sendVerificationCode } = require('../services/smsService');
const { sendEmail } = require('../services/emailService');

router.post('/', requireAuth, upload.array('images', 5), bodyHandler, async (req, res) => {
    try {
        const { name, date, location, description, price, ticketType, tags, capacity } = req.body;
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to update this event' });
        }
        
        const eventDate = new Date(date);
        const currentDate = new Date();
        if (eventDate <= currentDate) {
            return res.status(400).json({ error: 'Event date must be in the future' });
        }

        if (capacity <= 0) {
            return res.status(400).json({ error: 'Capacity must be greater than 0' });
        }

        if (price < 0) {
            return res.status(400).json({ error: 'Price must be greater than or equal to 0' });
        }

        let imageUrls = [];
        if (req.files) {
            for (let file of req.files) {
                const media = new Media({
                    title: file.originalname,
                    url: file.path,
                    type: 'image'
                });
                await media.save();
                imageUrls.push(media._id);
            }
        }

        const event = new Event({ name, date, location, description, price, ticketType, images: imageUrls, tags, capacity });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('attendees', 'firstName lastName email phoneNumber role');
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single event by ID
router.get('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId).populate('attendees', 'firstName lastName email phoneNumber role');
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update an event by ID
router.put('/:eventId', requireAuth, bodyHandler, async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const { name, date, location, description, price, ticketType, images, tags, capacity } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to update this event' });
        }

        const event = await Event.findByIdAndUpdate(eventId, { name, date, location, description, price, ticketType, images, tags, capacity }, { new: true });

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
        res.status(400).json({ error: error.message });
    }
});


// Reserve a ticket for an event
router.post('/:eventId/reserve', async (req, res) => {
    try {
        const { fullName, email, phoneNumber, quantity } = req.body;
        const eventId = req.params.eventId;
        
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.attendees.length + quantity > event.capacity) {
            return res.status(400).json({ error: 'Not enough spots available' });
        }

        // Generate OTP
        const OTPCode = crypto.randomInt(100000, 999999);
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const newOTP = new OTP({
            code: OTPCode,
            phoneNumber,
            expiresAt,
            used: false
        });

        await newOTP.save();
        await sendVerificationCode(phoneNumber, OTPCode);

        res.status(200).json({ message: 'Verification code sent. Please confirm your reservation.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Confirm reservation
router.post('/:eventId/confirm-reservation', async (req, res) => {
    try {
        const { phoneNumber, code, fullName, email, quantity } = req.body;
        const eventId = req.params.eventId;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const otp = await OTP.findOne({ phoneNumber, code, used: false });
        if (!otp) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        otp.used = true;
        await otp.save();

        for (let i = 0; i < quantity; i++) {
            const ticket = new Ticket({ eventId, fullName, email, phoneNumber, ticketStatus: 'reserved' });
            await ticket.save();
        }

        event.attendees.push(...Array(quantity).fill({ fullName, email, phoneNumber }));
        await event.save();

        await sendEmail({
            to: email,
            subject: 'Reservation Confirmation',
            text: `You have successfully reserved ${quantity} ticket(s) for the event: ${event.name}.`
        });

        res.status(200).json({ message: 'Reservation confirmed' });
    } catch (error) {
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