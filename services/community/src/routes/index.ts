import { Router } from 'express';
import threadRoutes from './threads';
import postRoutes from './posts';
import userRoutes from './users';

const router = Router();

router.use('/threads', threadRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);

export default router;
