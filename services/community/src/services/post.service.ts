import { prisma } from '../db/client';
import { queueService } from './queue.service';
import { Post } from '@prisma/client';

export class PostService {
  async create(data: {
    content: string;
    threadId: string;
    authorId: string;
  }): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        content: data.content,
        threadId: data.threadId,
        authorId: data.authorId,
      },
      include: {
        author: true,
      },
    });

    // Publish indexing job
    await queueService.publishPostIndexing(post.id);

    return post;
  }

  async upvote(id: string): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
  }

  async markAsAccepted(id: string): Promise<Post> {
    // First, get the post to find its threadId
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new Error('Post not found');
    }

    // Unmark other accepted answers in the thread
    await prisma.post.updateMany({
      where: {
        threadId: post.threadId,
        isAcceptedAnswer: true,
      },
      data: { isAcceptedAnswer: false },
    });

    // Mark this post as accepted
    return prisma.post.update({
      where: { id },
      data: { isAcceptedAnswer: true },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }
}

export const postService = new PostService();
