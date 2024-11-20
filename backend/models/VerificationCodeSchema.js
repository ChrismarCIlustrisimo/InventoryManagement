// verificationCode.model.js
import mongoose from 'mongoose';

const VerificationCodeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export default mongoose.model('VerificationCode', VerificationCodeSchema);
