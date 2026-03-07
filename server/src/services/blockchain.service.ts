import { env } from '../config/env.js';

/**
 * HTTP client for a Bitcoin Core REST API.
 * Base URL should point to the /rest endpoint (e.g. http://host/rest).
 */
class BlockchainService {
    private baseUrl: string;

    constructor() {
        // Strip trailing slash for clean concatenation
        this.baseUrl = env.blockchain.apiUrl.replace(/\/+$/, '');
    }

    /**
     * Performs a GET request to the Bitcoin Core REST API.
     * Appends `.json` to the endpoint automatically.
     */
    async get<T>(endpoint: string): Promise<T> {
        // Handle query parameters and ensure .json extension
        const [pathPart, queryPart] = endpoint.split('?');
        const extension = pathPart.endsWith('.json') ? '' : '.json';
        const url = `${this.baseUrl}${pathPart}${extension}${queryPart ? `?${queryPart}` : ''}`;

        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(
                `Blockchain REST error: ${response.status} ${response.statusText} (${url})`
            );
        }

        return response.json() as Promise<T>;
    }
}

// Singleton instance
export const blockchainService = new BlockchainService();
