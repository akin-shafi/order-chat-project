/* eslint-disable prettier/prettier */
import rateLimit from 'express-rate-limit';

// Set up the rate limiter
const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 75, // limit each IP to 75 requests per windowMs
  message: {
    status: 429,
    message: 'Too many requests, please try again in 10 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default rateLimiter;
