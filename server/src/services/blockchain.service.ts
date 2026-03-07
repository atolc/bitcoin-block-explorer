import { env } from '../config/env.js';

/**
 * Generic HTTP client for the Blockchain API.
 * All external API calls go through this service.
 */
class BlockchainService {
    private baseUrl: string;
    private apiToken: string;

    constructor() {
        this.baseUrl = env.blockchain.apiUrl;
        this.apiToken = env.blockchain.apiToken;
    }

    /**
     * Performs a GET request to the blockchain API.
     */
    async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        const url = new URL(endpoint, this.baseUrl);

        // Add query parameters
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.set(key, value);
            });
        }

        // Add API token if available
        if (this.apiToken) {
            url.searchParams.set('api_code', this.apiToken);
        }

        const response = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(
                `Blockchain API error: ${response.status} ${response.statusText}`
            );
        }

        return response.json() as Promise<T>;
    }
}

// Singleton instance
export const blockchainService = new BlockchainService();
