import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import { connection } from '../db/redis.js';
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10, 
	standardHeaders: 'draft-8',
	legacyHeaders: false, 
	ipv6Subnet: 56, 
	store: new RedisStore({
        sendCommand: (...args) => connection.call(...args),
    }),
})
export default limiter;
export const looseLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 50, 
    message: "You are commenting too fast! Please take a break.",
    store: new RedisStore({ sendCommand: (...args) => connection.call(...args) }),
})
