import express from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import VerificationCode from '../models/VerificationCodeSchema.js';


const router = express.Router();


// jwt token generator
const createToken = (user) => {
    // Include user ID and name in the token payload
    return jwt.sign({ _id: user._id, name: user.name }, process.env.SECRET, { expiresIn: '3d' });
};

//signup route
router.post('/signup', async (req, res) => {
    const { username, password, name, contact, role, email } = req.body;

    try {
        const user = await User.signup(username, password, name, contact, role, email);
        const token = createToken(user);
        res.status(201).json({ username, name, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/check-user', async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findOne({ username, email });
        if (user) {
            return res.json({ exists: true, user });  // Return user object as part of the response
        } else {
            return res.json({ exists: false });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});



router.post('/reset-password', async (req, res) => {
    const { username, email, newPassword } = req.body;

    try {
        const user = await User.findOne({ username, email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Hash and set new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Server error' });
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



// Get all users, with an optional filter for archived users
router.get('/', async (req, res) => {
    try {
        const { archived } = req.query;

        // If 'archived' is true, fetch archived users, otherwise fetch non-archived users or all users
        const filter = archived === 'true' ? { archived: true } : (archived === 'false' ? { archived: false } : {});

        const users = await User.find(filter);
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


// Update user (PATCH route)
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

router.patch('/:id/archive', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Make sure to use the correct field name `archived` here
        user.archived = true;
        await user.save();

        res.status(200).json({ message: 'User archived successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to restore a user (set archived to false)
router.patch('/:id/restore', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Restore the user by setting archived to false
        user.archived = false;
        await user.save();

        res.status(200).json({ message: 'User restored successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
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






const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // Email address from .env
        pass: process.env.EMAIL_PASS,  // Email password from .env
    },
  });
  // Example function to send an email
  const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: to,                        // Recipient address
        subject: subject,              // Subject line
        text: text,                    // Plain text body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
  };




router.post('/send-verification-code', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 10 minutes expiry

        // Upsert verification code in the database
        await VerificationCode.findOneAndUpdate(
            { email },
            { code: verificationCode, expiresAt },
            { upsert: true, new: true }
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset Verification Code',
            text: `Your verification code is: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending error:', error);
                return res.status(500).json({ message: 'Failed to send verification code', error });
            }
            console.log('Verification code sent:', info);
            res.status(200).json({ message: 'Verification code sent successfully' });
        });

    } catch (error) {
        console.error('Error sending verification code:', error);
        return res.status(500).json({ message: 'Failed to send verification code' });
    }
});router.post('/verify-code', async (req, res) => { 
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and verification code are required' });
    }

    try {
        const verification = await VerificationCode.findOne({ email });

        if (!verification) {
            return res.status(400).json({ success: false, message: 'No code sent to this email' });
        }

        if (new Date() > verification.expiresAt) {
            await VerificationCode.deleteOne({ email }); // Clean up expired code
            return res.status(400).json({ success: false, message: 'Verification code has expired' });
        }

        if (verification.code === code.trim()) {
            await VerificationCode.deleteOne({ email }); // Delete the code after successful verification
            return res.status(200).json({ success: true, message: 'Code verified successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

    } catch (error) {
        console.error('Error verifying code:', error);
        return res.status(500).json({ message: 'Failed to verify code' });
    }
});




// Using PUT for password reset
router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash the new password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword; // Update the password
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Failed to reset password' });
    }
});





export default router;
