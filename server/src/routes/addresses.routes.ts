import { Router } from 'express';
import * as addressesController from '../controllers/addresses.controller.js';

const router = Router();

router.get('/:address', addressesController.getAddress);
router.get('/:address/transactions', addressesController.getAddressTransactions);

export default router;
