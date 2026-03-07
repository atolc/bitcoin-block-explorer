import { Router } from 'express';
import * as blocksController from '../controllers/blocks.controller.js';

const router = Router();

router.get('/latest', blocksController.getLatest);
router.get('/:identifier', blocksController.getByIdentifier);

export default router;
