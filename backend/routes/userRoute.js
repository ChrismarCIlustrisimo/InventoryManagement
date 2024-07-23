import express from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();



const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

// Signup user
router.post('/signup', async (req, res) => {
    const { username, password, name, contact, role } = req.body;

    try {
        const user = await User.signup(username, password, name, contact, role);

        // Create a token for the user
        const token = createToken(user._id);

        res.status(201).json({ username, token });
    } catch (error) {
        if (!res.headersSent) {
            res.status(400).json({ error: error.message });
        }
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);

        // Create a token for the user
        const token = createToken(user._id);

        res.status(200).json({ username, token });
    } catch (error) {
        if (!res.headersSent) {
            res.status(400).json({ error: error.message });
        }
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
router.patch('/:id', async (req, res) => {
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

export default router;
