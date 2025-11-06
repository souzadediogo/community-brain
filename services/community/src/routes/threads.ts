import { Router, Request, Response } from 'express';
import { threadService } from '../services/thread.service';
import {
  CreateThreadDto,
  UpdateThreadDto
} from '../types/api.types';
import {
  validateBody,
  createThreadSchema,
  updateThreadSchema
} from '../middleware/validation.middleware';
import {
  sendSuccess,
  sendError,
  createApiError,
  createPaginationMeta
} from '../utils/response.util';

const router = Router();

// GET /threads
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tags, status, limit = '10', offset = '0', page = '1' } = req.query;

    const parsedLimit = parseInt(limit as string);
    const parsedOffset = parseInt(offset as string);
    const parsedPage = parseInt(page as string);

    const threads = await threadService.getAll({
      tags: tags ? (tags as string).split(',') : undefined,
      status: status as string,
      limit: parsedLimit,
      offset: parsedOffset,
    });

    // In a real implementation, you'd get the total count from the service
    const total = threads.length;
    const pagination = createPaginationMeta(total, parsedPage, parsedLimit);

    sendSuccess(res, threads, 200, pagination);
  } catch (error) {
    console.error('Error fetching threads:', error);
    sendError(
      res,
      createApiError('FETCH_ERROR', 'Failed to fetch threads'),
      500
    );
  }
});

// GET /threads/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const thread = await threadService.getById(req.params.id);

    if (!thread) {
      sendError(
        res,
        createApiError('NOT_FOUND', 'Thread not found'),
        404
      );
      return;
    }

    sendSuccess(res, thread);
  } catch (error) {
    console.error('Error fetching thread:', error);
    sendError(
      res,
      createApiError('FETCH_ERROR', 'Failed to fetch thread'),
      500
    );
  }
});

// POST /threads
// Note: In production, authorId would come from authenticated session
router.post(
  '/',
  validateBody(createThreadSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const createThreadDto = req.body as CreateThreadDto;

      // TODO: Get authorId from authenticated user session
      // For now, we'll need to accept it in the body temporarily
      const authorId = (req.body as any).authorId || 'temp-user-id';

      const thread = await threadService.create({
        title: createThreadDto.title,
        body: createThreadDto.content, // Map 'content' to 'body' for service
        tags: createThreadDto.tags || [],
        authorId,
      });

      sendSuccess(res, thread, 201);
    } catch (error) {
      console.error('Error creating thread:', error);
      sendError(
        res,
        createApiError('CREATE_ERROR', 'Failed to create thread'),
        500
      );
    }
  }
);

// PATCH /threads/:id
router.patch(
  '/:id',
  validateBody(updateThreadSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updateThreadDto = req.body as UpdateThreadDto;

      // Map API data to service format
      // Note: We accept the validated data which uses UPPERCASE status from Prisma
      const updateData: any = {};
      if (updateThreadDto.title) updateData.title = updateThreadDto.title;
      if (updateThreadDto.content) updateData.body = updateThreadDto.content;
      if (updateThreadDto.tags) updateData.tags = updateThreadDto.tags;
      if (updateThreadDto.status) updateData.status = updateThreadDto.status;

      const thread = await threadService.update(req.params.id, updateData);

      if (!thread) {
        sendError(
          res,
          createApiError('NOT_FOUND', 'Thread not found'),
          404
        );
        return;
      }

      sendSuccess(res, thread);
    } catch (error) {
      console.error('Error updating thread:', error);
      sendError(
        res,
        createApiError('UPDATE_ERROR', 'Failed to update thread'),
        500
      );
    }
  }
);

// DELETE /threads/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await threadService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting thread:', error);
    sendError(
      res,
      createApiError('DELETE_ERROR', 'Failed to delete thread'),
      500
    );
  }
});

export default router;
