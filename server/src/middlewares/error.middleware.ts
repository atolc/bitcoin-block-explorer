import type { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
    statusCode?: number;
    details?: unknown;
}

export function errorMiddleware(
    err: ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    const statusCode = err.statusCode ?? 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[ERROR] ${statusCode} - ${message}`, err.details ?? '');

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
}

export function createApiError(message: string, statusCode = 500, details?: unknown): ApiError {
    const error = new Error(message) as ApiError;
    error.statusCode = statusCode;
    error.details = details;
    return error;
}
