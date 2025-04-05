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

// Import handlers
const bodyHandler = require('../handlers/bodyHandler');

// Constants
const secret = process.env.JWT_SECRET;
const requireAuth = passport.authenticate('jwt', { session: false });


// Change password logged in user
router.post('/change-password', requireAuth, async (req, res) => {

    try {
        const check = ['oldPassword', 'newPassword'];
        bodyHandler(check, req.body);

        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        if (!user){
            throw new Error('User not found');
        }

        const isMatch = await bcryptjs.compare(oldPassword, user.password);

        if (!isMatch){
            throw new Error('Old password is incorrect');
        }

        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

        if (!passwordRegex.test(newPassword)){
            throw new Error('Password is not strong enough');
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).send('Password changed successfully');

    }
    catch (error) {
        res.status(400).send(error.message);
    }
});


// Change password without logging in
router.post('/change-password/:id', async (req, res) => {

    try {
        const check = ['newPassword'];
        bodyHandler(check, req.body);

        const { newPassword } = req.body;

        const user = await User.findById(req.params.id);

        if (!user){
            throw new Error('User not found');
        }

        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

        if (!passwordRegex.test(newPassword)){
            throw new Error('Password is not strong enough');
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).send('Password changed successfully');

    }
    catch (error) {
        res.status(400).send(error.message);
    }
});


// Get user by ID
router.get('/:id', requireAuth, async (req, res) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user){
            throw new Error('User not found');
        }

        // Remove password and __v from user object
        user.password = undefined;
        user.__v = undefined;

        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all users
router.get('/', requireAuth, async (req, res) => {

    try {
        const users = await User.find();

        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});


// Update user information given an email
router.patch('/:id', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new Error('User  not found');
        }

        const check = ['firstName', 'lastName', 'email', 'phoneNumber'];
        bodyHandler(check, req.body);

        const { firstName, lastName, email, phoneNumber } = req.body;

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phoneNumber = phoneNumber;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// Delete user
router.delete('/:id', requireAuth, async (req, res) => {
    
        try {
            const user = await User.findById(req.params.id);
    
            if (!user){
                throw new Error('User not found');
            }
    
            await user.remove();
    
            res.status(200).send('User deleted');
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    }
);


// Make user admin given an email
router.post('/make-admin', async (req, res) => {
    try {
        const { godEmail, godPassword, newAdminEmail } = req.body;
        
        // Verificar que todos los campos necesarios estén presentes
        if (!godEmail || !godPassword || !newAdminEmail) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Buscar el usuario GOD por email
        const godUser = await User.findOne({ email: godEmail });
        if (!godUser) {
            return res.status(404).json({ error: 'Admin GOD not found' });
        }
        
        // Verificar que el usuario GOD tenga el rol correcto
        if (godUser.role !== 'god') {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }
        
        // Verificar la contraseña del usuario GOD
        const isPasswordValid = await bcryptjs.compare(godPassword, godUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Buscar el usuario que se convertirá en administrador
        const userToAdmin = await User.findOne({ email: newAdminEmail });
        if (!userToAdmin) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verificar que el usuario no sea ya un administrador
        if (userToAdmin.role === 'admin' || userToAdmin.role === 'god') {
            return res.status(400).json({ error: 'User is already an admin or god' });
        }
        
        // Cambiar el rol del usuario a administrador
        userToAdmin.role = 'admin';
        await userToAdmin.save();
        
        // Responder con éxito
        return res.status(201).json({ 
            success: true,
            message: 'User promoted to admin successfully',
            user: {
                id: userToAdmin._id,
                email: userToAdmin.email,
                role: userToAdmin.role
            }
        });
    } catch (error) {
        console.error('Error making user admin:', error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;