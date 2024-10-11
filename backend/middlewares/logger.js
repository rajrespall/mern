// /middleware/logger.js
const logger = (req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
};

module.exports = logger;
