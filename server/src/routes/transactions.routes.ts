import { Router } from 'express';
import * as transactionsController from '../controllers/transactions.controller.js';

const router = Router();

router.get('/latest', transactionsController.getLatest);
router.get('/:hash', transactionsController.getByHash);

export default router;
