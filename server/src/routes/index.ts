import { Router } from 'express';
import blocksRoutes from './blocks.routes.js';
import transactionsRoutes from './transactions.routes.js';
import networkRoutes from './network.routes.js';
import configRoutes from './config.routes.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        },
    });
});

// Domain routes
router.use('/blocks', blocksRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/network', networkRoutes);
router.use('/config', configRoutes);

export default router;
