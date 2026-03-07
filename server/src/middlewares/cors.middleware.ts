import cors from 'cors';
import { env } from '../config/env.js';

export const corsMiddleware = cors({
    origin: env.cors.origin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});
