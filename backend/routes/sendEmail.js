import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a Nodemailer transporter
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

// Example usage of sendEmail function
sendEmail('recipient@example.com', 'Test Subject', 'Hello, this is a test email!');
