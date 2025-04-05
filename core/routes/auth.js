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
const { sendEmail } = require('../services/emailService');


// Middleware to check if the user is authenticated
const upload = require('../middlewares/multer');

// Register a new user with Costa Rican ID validation
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    try {
        // Required fields check
        const check = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'businessID', 'DNI', 'address'];
        bodyHandler(check, req.body);

        const { firstName, lastName, email, password, phoneNumber, businessID, DNI, address } = req.body;

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            throw new Error('User already exists');
        }

        // Password validation (min 8 chars, uppercase, lowercase, number)
        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        if (!passwordRegex.test(password)) {
            throw new Error('Password must contain at least 8 characters, one uppercase, one lowercase and one number');
        }

        // Costa Rican ID validation (9 digits)
        const cedulaRegex = new RegExp("^[0-9]{9}$");
        if (!cedulaRegex.test(DNI)) {
            throw new Error('Costa Rican ID must be 9 digits');
        }

        // Phone number validation (10 digits)
        const phoneRegex = new RegExp("^\\+[0-9]{11,15}$");
        if (!phoneRegex.test(phoneNumber)) {
            throw new Error('Phone number must be 12 digits');
        }

        const businessIDRegex = new RegExp("^[A-Z]{2}[0-9]{4}$");
        if (!businessIDRegex.test(businessID)) {
            throw new Error('Business ID must be 2 letters followed by 4 numbers');
        }

        // Email validation
        const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        // Handle profile picture upload
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

        // Create new user
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

        // Generate and save OTP
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let OTPCode = '';
        for (let i = 0; i < 6; i++) {
            OTPCode += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const newOTP = new OTP({
            code: OTPCode,
            userId: newUser._id,
            expiresAt
        });

        await newOTP.save();
        await sendVerificationCode(phoneNumber, newOTP.code);
        
        // Save user
        await newUser.save();

        // Return success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber
            },
            otp: {
                code: OTPCode,
                expiresAt: expiresAt
            }
        });
    } catch (error) {
        // Return error response
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
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

        // Return success response with token & user 
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: `Bearer ${token}`,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                businessID: user.businessID,
                DNI: user.DNI,
                address: user.address,
                verified: user.verified,
                role: user.role
            }
        });
        

    } catch (error){
        res.status(400).json({ error: error.message });
    }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const check = ['email'];
        bodyHandler(check, req.body);

        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user){
            throw new Error('User does not exist');
        }

        // Generate OTP code (6 random uppercase letters)
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let OTPCode = '';
        for (let i = 0; i < 6; i++) {
            OTPCode += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        // Save OTP code to database
        const newOTP = new OTP({
            code: OTPCode,
            userId: user._id,
            expiresAt
        });

        await newOTP.save();
        await sendVerificationCode(user.phoneNumber, OTPCode);

        // Send OTP to email
        await sendEmail({
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP code is ${OTPCode}. It will expire in 15 minutes.`,
            html: `<p>Your OTP code is <strong>${OTPCode}</strong>. It will expire in 15 minutes.</p>`
        });

        // Return success response
        res.status(200).json({
            success: true,
            message: 'OTP code sent to phone number',
            otp: {
                code: OTPCode,
                expiresAt: expiresAt
            }
        });
    } catch (error){
        // Return error response
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Reset password confirm
router.post('/reset-password', async (req, res) => {
    try {
        const check = ['email', 'OTP', 'newPassword'];
        bodyHandler(check, req.body);

        const { email, code, newPassword } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user){
            throw new Error('User does not exist');
        }

        // Check if OTP is valid
        const otp = await OTP.findOne({ userId: user._id, code: code, used: false });
        if (!otp){
            throw new Error('Invalid OTP code');
        }

        // Hash new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        // Mark OTP as used
        otp.used = true;
        await otp.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error){
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
