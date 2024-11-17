import mongoose from 'mongoose'; 
import bcrypt from 'bcrypt';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String },
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Invalid email'] },
    role: { type: String, required: true },
    archived: { type: Boolean, default: false }
});

// Static Signup method
userSchema.statics.signup = async function(username, password, name, contact, role, email) {
    // Validation
    if (!username || !password || !name || !contact || !role || !email) {
        throw new Error('Please provide username, password, name, contact, role, and email');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }

    if (!validator.isMobilePhone(contact)) {
        throw new Error('Contact is not a valid phone number');
    }

    if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }

    const exists = await this.findOne({ username });

    if (exists) {
        throw new Error('Username already exists');
    }

    const emailExists = await this.findOne({ email });

    if (emailExists) {
        throw new Error('Email already exists');
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new this({ username, password: hash, name, contact, role, email });
    try {
        return await user.save();
    } catch (error) {
        throw new Error('Failed to create user');
    }
}

userSchema.statics.login = async function(username, password, role) {
    if (!username || !password || !role) {  
        throw new Error('Please provide username, password, and role');
    }

    const user = await this.findOne({ username });

    if (!user) {
        throw new Error('Incorrect username');
    }
    if (user.archived) {
        throw new Error('This account is archived and cannot be accessed.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    // Role-based login permissions
    if (user.role === 'super-admin') {
        // Super admin can log in as admin or cashier
        if (role !== 'super-admin' && role !== 'admin' && role !== 'cashier') {
            throw new Error('Super Admin is not authorized for this role');
        }
    } else if (user.role === 'admin') {
        // Admin can log in as cashier or admin only
        if (role !== 'admin' && role !== 'cashier') {
            throw new Error('Admin is not authorized for this role');
        }
    } else if (user.role === 'cashier') {
        // Cashier can only log in as cashier
        if (role !== 'cashier') {
            throw new Error('Cashier is not authorized for this role');
        }
    } else {
        throw new Error('Invalid user role');
    }

    return user;  // Return the user if everything is okay
};

const User = mongoose.model('User', userSchema);

export default User;
