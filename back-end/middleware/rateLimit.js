const rateLimit = require('express-rate-limit');

const addReactionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: {
        status: 0,
        message: "Too many requests from this IP, please try again after an hour"
    }
});

module.exports = addReactionLimiter;
