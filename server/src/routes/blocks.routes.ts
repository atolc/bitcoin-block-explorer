import { Router } from 'express';
import * as blocksController from '../controllers/blocks.controller.js';

const router = Router();

router.get('/', blocksController.getPaginated);
router.get('/latest', blocksController.getLatest);
router.get('/:identifier', blocksController.getByIdentifier);
router.get('/:identifier/transactions', blocksController.getBlockTransactions);

export default router;
