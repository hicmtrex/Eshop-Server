const jwt = require('jsonwebtoken');
const User = require('../models/user');

export const protect = async (req, res, next) => {
    const { authorization } = req.headers;
    let token;

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1];
            const decodedUser = jwt.verify(token, process.env.SECRET_KEY);

            req.user = await User.findById(decodedUser.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('not authorized,token failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
};

export const admin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
});
