import { Router } from 'express';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (_req, res) => {
    res.json({
        success: true,
        data: {
            apiUrl: env.blockchain.apiUrl,
        },
    });
});

export default router;
