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

// Import handlers
const bodyHandler = require('../handlers/bodyHandler');

// Constants
const secret = process.env.JWT_SECRET;

// SMS:
const { sendVerificationCode } = require('../services/smsService');

// Middleware to check if the user is authenticated
const upload = require('../middlewares/multer');

// Register a new user:
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    try {
        const check = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'businessID', 'DNI', 'address'];
        bodyHandler(check, req.body);

        const { firstName, lastName, email, password, phoneNumber, businessID, DNI, address } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            throw new Error('User already exists');
        }

        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        if (!passwordRegex.test(password)) {
            throw new Error('Password is not strong enough');
        }

        const dniRegex = new RegExp("^[0-9]{8}[A-Z]$");
        if (!dniRegex.test(DNI)) {
            throw new Error('DNI is not valid');
        }

        const phoneRegex = new RegExp("^[0-9]{10}$");
        if (!phoneRegex.test(phoneNumber)) {
            throw new Error('Phone number is not valid');
        }

        const businessIDRegex = new RegExp("^[A-Z]{4}[0-9]{4}$");
        if (!businessIDRegex.test(businessID)) {
            throw new Error('Business ID is not valid');
        }

        const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
        if (!emailRegex.test(email)) {
            throw new Error('Email is not valid');
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        
        let profilePictureUrl = null;
        if (req.file) {
            const media = new Media({
                title: req.file.originalname,
                url: req.file.path,
                type: 'image'
            });
            await media.save();
            profilePictureUrl = media._id;
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            businessID,
            DNI,
            address,
            profilePicture: profilePictureUrl
        });

        const OTPCode = crypto.randomInt(100000, 999999);
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const newOTP = new OTP({
            code: OTPCode,
            userId: newUser._id,
            expiresAt
        });

        await newOTP.save();
        await sendVerificationCode(phoneNumber, newOTP.code);
        
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/verify-code", async (req, res) => {

    try {   
        const check = ['email', 'OTP'];
        bodyHandler(check, req.body);

        const { email, code } = req.body;

        const user = await User.findOne({ email });

        if (!user){
            throw new Error('User does not exist');
        }

        if (user.verified){
            throw new Error('User is already verified');
        }

        const otp = await OTP.findOne({ userId: user._id, code: code, used: false });

        if (!otp){
            throw new Error('Invalid OTP code');
        }

        user.verified = true;

        await user.save();

        res.json({ message: 'User verified' });
    }
    catch (error){
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const check = ['email', 'password'];
        bodyHandler(check, req.body);

        const { email, password } = req.body;

        const user = await User.findOne({ email });


        if (!user){
            throw new Error('User does not exist');
        }

        if (!user.verified){
            throw new Error('User is not verified');
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch){
            throw new Error('Invalid credentials');
        }

        const payload = {
            id: user._id,
            email: user.email
        };
        
        const token = jwt.sign(payload, secret, { expiresIn: 3600 });

        res.json({ token: `Bearer ${token}` });

    } catch (error){
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
