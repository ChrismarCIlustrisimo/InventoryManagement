import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    role: { type: String, required: true },
});

// Static Signup method
userSchema.statics.signup = async function(username, password, name, contact, role) {
    // Validation
    if (!username || !password || !name || !contact || !role) {
        throw new Error('Please provide username, password, name, contact, and role');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }

    if (!validator.isMobilePhone(contact)) {
        throw new Error('Contact is not a valid phone number');
    }

    const exists = await this.findOne({ username });

    if (exists) {
        throw new Error('Username already exists');
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new this({ username, password: hash, name, contact, role });
    try {
        return await user.save();  // Save the user to the database
    } catch (error) {
        throw new Error('Failed to create user');
    }
}


// Static Login method
// Static Login method
userSchema.statics.login = async function(username, password, role) {
    if (!username || !password || !role) {  
        throw new Error('Please provide username, password, and role');
    }

    const user = await this.findOne({ username });

    if (!user) {
        throw new Error('Incorrect username');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    // Allow admin to access cashier functionality
    if (role === 'cashier' && user.role !== 'cashier' && user.role !== 'admin') {
        throw new Error('User is not a cashier');
    }

    // If the user is an admin, allow them to log in regardless of the specified role
    if (role === 'admin' && user.role !== 'admin') {
        throw new Error('User is not an admin');
    }

    return user;  // Return the user if everything is okay
};



const User = mongoose.model('User', userSchema);

export default User;