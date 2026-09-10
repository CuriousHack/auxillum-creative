const rateLimit = require('express-rate-limit');

// In-memory store for tracking failed login attempts per key (IP + email)
const failedLoginStore = new Map();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes window
const MAX_FAILED_ATTEMPTS = 5;

// Periodic cleanup of expired entries every 2 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of failedLoginStore.entries()) {
        if (record.lockoutUntil && record.lockoutUntil < now) {
            failedLoginStore.delete(key);
        } else if (record.firstAttemptTime && (now - record.firstAttemptTime) > WINDOW_MS) {
            failedLoginStore.delete(key);
        }
    }
}, 2 * 60 * 1000);

/**
 * Get tracking identifier key (Client IP + Normalized Email)
 */
const getLoginKey = (req) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown-ip';
    const email = req.body && req.body.email ? String(req.body.email).toLowerCase().trim() : 'unknown-user';
    return `${clientIp}:${email}`;
};

/**
 * Middleware to check if an IP/Email is locked out due to 5 failed attempts in 5 minutes.
 */
const checkLoginLockout = (req, res, next) => {
    const key = getLoginKey(req);
    const record = failedLoginStore.get(key);
    const now = Date.now();

    if (record && record.lockoutUntil) {
        if (now < record.lockoutUntil) {
            const secondsRemaining = Math.ceil((record.lockoutUntil - now) / 1000);
            const minutesRemaining = Math.ceil(secondsRemaining / 60);
            res.setHeader('Retry-After', secondsRemaining);
            return res.status(429).json({
                message: `Too many failed login attempts. Account access is locked for ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}. Please try again later.`
            });
        } else {
            // Lockout period expired
            failedLoginStore.delete(key);
        }
    }
    next();
};

/**
 * Record a failed login attempt. Triggers 5-minute lockout on the 5th failure.
 */
const recordFailedLogin = (req, res, customMessage) => {
    const key = getLoginKey(req);
    const now = Date.now();

    let record = failedLoginStore.get(key);
    if (!record || (now - record.firstAttemptTime) > WINDOW_MS) {
        record = { attempts: 1, firstAttemptTime: now, lockoutUntil: null };
    } else {
        record.attempts += 1;
    }

    if (record.attempts >= MAX_FAILED_ATTEMPTS) {
        record.lockoutUntil = now + WINDOW_MS;
        failedLoginStore.set(key, record);
        res.setHeader('Retry-After', 300);
        return res.status(429).json({
            message: 'Too many failed login attempts. Access restricted for 5 minutes.'
        });
    }

    failedLoginStore.set(key, record);
    const attemptsRemaining = MAX_FAILED_ATTEMPTS - record.attempts;
    return res.status(401).json({
        message: customMessage || `Invalid email or password. ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining before a 5-minute lockout.`
    });
};

/**
 * Reset failed login attempt counter upon successful authentication.
 */
const resetFailedLogin = (req) => {
    const key = getLoginKey(req);
    failedLoginStore.delete(key);
};

/**
 * Express Rate Limiter for Authentication endpoints
 */
const authRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // 20 requests per 5 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many authentication requests from this IP. Please try again after 5 minutes.'
    }
});

/**
 * Express Rate Limiter for general API endpoints
 */
const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // 300 requests per 15 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many API requests from this IP. Please try again later.'
    }
});

module.exports = {
    checkLoginLockout,
    recordFailedLogin,
    resetFailedLogin,
    authRateLimiter,
    apiRateLimiter
};
