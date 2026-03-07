import morgan from 'morgan';
import { env } from '../config/env.js';

export const loggerMiddleware = morgan(
    env.nodeEnv === 'production' ? 'combined' : 'dev'
);
