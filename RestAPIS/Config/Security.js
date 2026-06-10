const helmet = require('helmet');
const ratelimit = require('express-rate-limit');

const helmetConfig = helmet();

const ratelimitConfig = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        status: 'Failed',
        message: 'Too Many Requests! Try after 15 minutes.'
    }
});

module.exports = {helmetConfig, ratelimitConfig};