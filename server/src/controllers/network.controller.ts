import type { Request, Response, NextFunction } from 'express';
import { getNetworkStats } from '../services/network.service.js';
import { createApiError } from '../middlewares/error.middleware.js';

/**
 * GET /api/network/stats
 * Returns current network statistics.
 */
export async function getStats(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const stats = await getNetworkStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        next(createApiError('Failed to fetch network stats', 502, error));
    }
}
