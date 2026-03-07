import type { Request, Response, NextFunction } from 'express';
import { getLatestBlocks, getBlockByHashOrHeight, getPaginatedBlocks, getBlockTransactionsPaginated } from '../services/blocks.service.js';
import { createApiError } from '../middlewares/error.middleware.js';

/**
 * GET /api/blocks/latest
 * Returns the latest blocks.
 */
export async function getLatest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const count = parseInt(req.query.count as string) || 5;
        const blocks = await getLatestBlocks(count);
        res.json({ success: true, data: blocks });
    } catch (error) {
        next(createApiError('Failed to fetch latest blocks', 502, error));
    }
}

/**
 * GET /api/blocks
 * Returns paginated blocks.
 */
export async function getPaginated(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await getPaginatedBlocks(page, limit);
        res.json({ success: true, data: result });
    } catch (error) {
        next(createApiError('Failed to fetch paginated blocks', 502, error));
    }
}

/**
 * GET /api/blocks/:identifier
 * Returns a block by hash or height.
 */
export async function getByIdentifier(
    req: Request<{ identifier: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { identifier } = req.params;
        if (!identifier) {
            res.status(400).json({ success: false, error: { message: 'Block identifier is required' } });
            return;
        }
        const block = await getBlockByHashOrHeight(identifier);
        res.json({ success: true, data: block });
    } catch (error) {
        next(createApiError('Failed to fetch block', 502, error));
    }
}

/**
 * GET /api/blocks/:identifier/transactions
 * Returns paginated transactions for a specific block.
 */
export async function getBlockTransactions(
    req: Request<{ identifier: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { identifier } = req.params;
        if (!identifier) {
            res.status(400).json({ success: false, error: { message: 'Block identifier is required' } });
            return;
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await getBlockTransactionsPaginated(identifier, page, limit);
        res.json({ success: true, data: result });
    } catch (error) {
        next(createApiError('Failed to fetch block transactions', 502, error));
    }
}
