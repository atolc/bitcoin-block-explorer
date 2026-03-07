import dotenv from 'dotenv';
import path from 'node:path';

// Load .env from root directory
dotenv.config({ path: path.resolve(import.meta.dirname, '../../.env') });

export interface EnvConfig {
    port: number;
    nodeEnv: string;
    blockchain: {
        apiUrl: string;
        apiToken: string;
    };
    cors: {
        origin: string;
    };
}

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const env: EnvConfig = {
    port: parseInt(getEnvVar('PORT', '3001'), 10),
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    blockchain: {
        apiUrl: getEnvVar('BLOCKCHAIN_API_URL', 'https://blockchain.info'),
        apiToken: getEnvVar('BLOCKCHAIN_API_TOKEN', ''),
    },
    cors: {
        origin: getEnvVar('CORS_ORIGIN', 'http://localhost:5174'),
    },
};
