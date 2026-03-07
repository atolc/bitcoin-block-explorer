import { Router } from 'express';
import * as networkController from '../controllers/network.controller.js';

const router = Router();

router.get('/stats', networkController.getStats);

export default router;
