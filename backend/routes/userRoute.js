import express from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();


// jwt token generator
const createToken = (user) => {
    // Include user ID and name in the token payload
    return jwt.sign({ _id: user._id, name: user.name }, process.env.SECRET, { expiresIn: '3d' });
};

//signup route
router.post('/signup', async (req, res) => {
    const { username, password, name, contact, role } = req.body;

    try {
        const user = await User.signup(username, password, name, contact, role);
        const token = createToken(user);
        res.status(201).json({ username, name, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// login route
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.login(username, password, role);
        const token = createToken(user); // Generate token
        res.status(200).json({
            token,
            name: user.name,
            role: user.role,
            contact: user.contact,
            _id: user._id // Add _id to the response
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Update user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, name, contact, role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (username) user.username = username;
        if (password) user.password = await bcrypt.hash(password, 10); // Hash new password
        if (name) user.name = name;
        if (contact) user.contact = contact;
        if (role) user.role = role;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to handle password change
router.patch('/:id/change-password', async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

        if (!newPassword) return res.status(400).json({ error: 'New password cannot be empty' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error during password change:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Route to validate current password
router.post('/:id/validate-password', async (req, res) => {
    const { id } = req.params;
    const { currentPassword } = req.body;
    console.log('Request payload:', { currentPassword });

    try {
        console.log('Validating password for user:', id);
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

        res.status(200).json({ valid: true });
    } catch (error) {
        console.error('Error during password validation:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



export default router;
