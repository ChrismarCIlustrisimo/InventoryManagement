import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const requireAuth = async (request, response, next) => {
    // verify authentication
    const { authorization } = request.headers;
    if (!authorization) {
        return response.status(401).json({ error: 'Authorization required' });
    }

    const token = authorization.split(' ')[1];
    try {
        // Verify JWT token
        const { _id } = jwt.verify(token, process.env.SECRET);

        // Find user in database based on _id from JWT
        const user = await User.findOne({ _id }).select('_id');

        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }

        // Assign user to request object for further middleware or route handling
        request.user = user;

        // Call next() to move on to the next middleware or route handler
        next();

    } catch (error) {
        console.error(error);
        response.status(401).json({ error: 'Unauthorized request' });
    }
};

export default requireAuth;
