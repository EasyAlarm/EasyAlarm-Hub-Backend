import Router from 'express';
import { getAllLogsHandler } from '../controllers/logController';

const router = Router();

router
    .route('/')
    .get(getAllLogsHandler);

export default router;