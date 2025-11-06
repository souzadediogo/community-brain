import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { communityClient } from '../services/http-client';

const router = Router();

// Get all threads
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const threads = await communityClient.get('/threads');
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// Get single thread
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const thread = await communityClient.get(`/threads/${req.params.id}`);
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

// Create thread (requires auth)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.substring(7);
    const thread = await communityClient.post('/threads', req.body, token);
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// Create post in thread (requires auth)
router.post('/:id/posts', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.substring(7);
    const post = await communityClient.post(
      `/threads/${req.params.id}/posts`,
      req.body,
      token
    );
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;
