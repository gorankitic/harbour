const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors/safe');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
require('dotenv').config();
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

// Limit number of http requests to 100 request from same IP in 1 hour
const limiter = rateLimit({
    max: 500, windowMs: 1000 * 60 * 60, message: 'Too many request from this IP, try again in 1 hour.'
});

// Middlewares
app.use(helmet());
app.use('/api', limiter);
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Preventing parameter pollution
app.use(hpp());

// Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
(async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log(colors.bgGreen.bold('Database connected successfully.'));
        // Start listening for http requests
        const server = app.listen(port, () => {
            console.log(colors.bgGreen.bold(`Server is up in ${process.env.NODE_ENV} mode on port ${port}.`));
        });
    } catch (error) {
        console.log(colors.bgRed.bold(error.message));
    } 
})();