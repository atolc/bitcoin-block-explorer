import type { Request, Response } from 'express';
import * as addressService from '../services/addresses.service.js';

export async function getAddress(req: Request, res: Response) {
    try {
        const address = req.params.address as string;
        const info = await addressService.getAddressInfo(address);
        res.json({ success: true, data: info });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: error instanceof Error ? error.message : 'Unknown error' },
        });
    }
}

export async function getAddressTransactions(req: Request, res: Response) {
    try {
        const address = req.params.address as string;
        const txs = await addressService.getAddressTransactions(address);
        res.json({ success: true, data: txs });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: error instanceof Error ? error.message : 'Unknown error' },
        });
    }
}
