import { Router, Request, Response } from 'express';
import { userService } from '../services/user.service';

const router = Router();

// GET /users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAll();
    res.json({ data: users, total: users.length });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/experts
router.get('/experts', async (req: Request, res: Response) => {
  try {
    const { tags } = req.query;
    const experts = await userService.findExperts(
      tags ? (tags as string).split(',') : undefined
    );
    res.json({ data: experts, total: experts.length });
  } catch (error) {
    console.error('Error fetching experts:', error);
    res.status(500).json({ error: 'Failed to fetch experts' });
  }
});

// GET /users/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getById(req.params.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /users
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, title, org, expertiseTags } = req.body;

    if (!name || !email) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email']
      });
      return;
    }

    const user = await userService.create({
      name,
      email,
      title,
      org,
      expertiseTags: expertiseTags || [],
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }

    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PATCH /users/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
