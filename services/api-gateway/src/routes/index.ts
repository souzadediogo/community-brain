import { Router } from 'express';
import healthRoutes from './health';
import threadRoutes from './threads';
import assistantRoutes from './assistant';

const router = Router();

router.use('/', healthRoutes);
router.use('/threads', threadRoutes);
router.use('/assistant', assistantRoutes);

export default router;
