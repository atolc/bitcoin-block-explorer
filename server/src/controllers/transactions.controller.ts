import type { Request, Response, NextFunction } from 'express';
import * as transactionsService from '../services/transactions.service.js';
import { createApiError } from '../middlewares/error.middleware.js';

/**
 * GET /api/transactions
 * Returns paginated unconfirmed transactions.
 */
export async function getPaginated(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await transactionsService.getPaginatedTransactions(page, limit);
        res.json({ success: true, data: result });
    } catch (error) {
        next(createApiError('Failed to fetch paginated transactions', 502, error));
    }
}

/**
 * GET /api/transactions/latest
 * Returns the latest unconfirmed transactions.
 */
export async function getLatest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const count = parseInt(req.query.count as string) || 10;
        const transactions = await transactionsService.getLatestTransactions(count);
        res.json({ success: true, data: transactions });
    } catch (error) {
        next(createApiError('Failed to fetch latest transactions', 502, error));
    }
}

/**
 * GET /api/transactions/:hash
 * Returns a transaction by hash.
 */
export async function getByHash(
    req: Request<{ hash: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { hash } = req.params;
        if (!hash) {
            res.status(400).json({ success: false, error: { message: 'Transaction hash is required' } });
            return;
        }
        const transaction = await transactionsService.getTransactionByHash(hash);
        res.json({ success: true, data: transaction });
    } catch (error) {
        next(createApiError('Failed to fetch transaction', 502, error));
    }
}
