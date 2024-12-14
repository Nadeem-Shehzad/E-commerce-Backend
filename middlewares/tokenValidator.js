const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const tokenValidator = asyncHandler(async (req, res, next) => {
    let token;
    const authHeaders = req.headers.Authorization || req.headers.authorization;

    if (authHeaders && (authHeaders.startsWith('Bearer'))) {
        token = authHeaders.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Error('User is not Authorized!');
            }

            req.user = decoded.user;
            next();
        });

    }

    if (!token) {
        res.status(401);
        throw new Error('User is not authorized or token is missing !');
    }
});

module.exports = tokenValidator;