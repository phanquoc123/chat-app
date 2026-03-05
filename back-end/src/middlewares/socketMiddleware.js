import User from "../models/User.js";
import jwt from 'jsonwebtoken';


export const socketMiddleware = async(socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decoded) {
            return next(new Error('Authentication error'));
        }
     const user = await User.findById(decoded.userId).select('-password');
     if (!user) {
        return next(new Error('User not found'));
     }
     socket.user = user;
        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
    }
}