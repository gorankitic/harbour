const AppError = require('../utils/AppError');

// Handling invalid database IDs
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

// Handling duplicate database fields
const handleDuplicateFieldDB = err => {
    const value = Object.values(err.keyValue)[0];
    const message = `${value} already in use.`;
    return new AppError(message, 400);
}

// Handling mongoose validation errors
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `${errors.join('. ')}`;
    return new AppError(message, 400);
}

// Handling invalid JWT error
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);

// Handling expired JWT error
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

// Send more error details to client when in development mode
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

// Send error to client when in production mode
const sendErrorProd = (err, res) => {
    // Operational, trusted error (like exception)
    // Send nice, human readable message to client
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Programming or other unknown error, don't leak too much details
        // 1. Log error
        console.log('❌ERROR: ', err);
        // 2. Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong.'
        });
    }   
}

// Global error handling middleware
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Separate errors in development and production mode
    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error = Object.assign(err);

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError();
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        
        sendErrorProd(error, res);
    }
}