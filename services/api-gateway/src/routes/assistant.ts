import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { assistantClient } from '../services/http-client';

const router = Router();

// Ask Braintrust
router.post('/ask', async (req: AuthRequest, res: Response) => {
  try {
    const response = await assistantClient.post('/ask', req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get answer' });
  }
});

// Summarize thread
router.post('/summarize', async (req: AuthRequest, res: Response) => {
  try {
    const response = await assistantClient.post('/summarize', req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

// Find experts
router.get('/experts', async (req: AuthRequest, res: Response) => {
  try {
    const response = await assistantClient.get(
      `/experts?tags=${req.query.tags}`
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find experts' });
  }
});

// Find similar threads
router.get('/similar', async (req: AuthRequest, res: Response) => {
  try {
    const response = await assistantClient.get(
      `/similar?q=${req.query.q}&top_k=${req.query.top_k || 5}`
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find similar threads' });
  }
});

export default router;
