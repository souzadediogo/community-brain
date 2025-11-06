import { Router, Request, Response } from 'express';
import { postService } from '../services/post.service';
import {
  CreatePostDto,
  VotePostDto
} from '../types/api.types';
import {
  validateBody,
  createPostSchema,
  votePostSchema
} from '../middleware/validation.middleware';
import {
  sendSuccess,
  sendError,
  createApiError
} from '../utils/response.util';

const router = Router();

// POST /posts
router.post(
  '/',
  validateBody(createPostSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const createPostDto = req.body as CreatePostDto;

      // TODO: Get authorId from authenticated user session
      const authorId = (req.body as any).authorId || 'temp-user-id';

      const post = await postService.create({
        content: createPostDto.content,
        threadId: createPostDto.threadId,
        authorId,
      });

      sendSuccess(res, post, 201);
    } catch (error) {
      console.error('Error creating post:', error);
      sendError(
        res,
        createApiError('CREATE_ERROR', 'Failed to create post'),
        500
      );
    }
  }
);

// POST /posts/:id/vote
// Note: Using the new voting endpoint that supports upvote/downvote
router.post(
  '/:id/vote',
  validateBody(votePostSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { vote } = req.body as VotePostDto;
      const postId = req.params.id;

      // For now, keep using the upvote method, but this can be extended
      // to handle downvotes as well
      const post = vote === 1
        ? await postService.upvote(postId)
        : await postService.upvote(postId); // TODO: Add downvote method

      sendSuccess(res, post);
    } catch (error) {
      console.error('Error voting on post:', error);
      sendError(
        res,
        createApiError('VOTE_ERROR', 'Failed to vote on post'),
        500
      );
    }
  }
);

// Legacy endpoint - keeping for backwards compatibility
// POST /posts/:id/upvote
router.post('/:id/upvote', async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await postService.upvote(req.params.id);
    sendSuccess(res, post);
  } catch (error) {
    console.error('Error upvoting post:', error);
    sendError(
      res,
      createApiError('UPVOTE_ERROR', 'Failed to upvote post'),
      500
    );
  }
});

// POST /posts/:id/accept
router.post('/:id/accept', async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await postService.markAsAccepted(req.params.id);
    sendSuccess(res, post);
  } catch (error) {
    console.error('Error accepting post:', error);
    sendError(
      res,
      createApiError('ACCEPT_ERROR', 'Failed to accept post'),
      500
    );
  }
});

// DELETE /posts/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await postService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    sendError(
      res,
      createApiError('DELETE_ERROR', 'Failed to delete post'),
      500
    );
  }
});

export default router;
