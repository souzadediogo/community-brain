import { prisma } from '../db/client';
import { queueService } from './queue.service';
import { Thread, Prisma, ThreadStatus } from '@prisma/client';

export class ThreadService {
  async getAll(filters?: {
    tags?: string[];
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Thread[]> {
    const where: Prisma.ThreadWhereInput = {};

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    if (filters?.status) {
      where.status = filters.status as any;
    }

    return prisma.thread.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            title: true,
            org: true,
            expertiseTags: true,
          },
        },
        posts: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        },
      },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string): Promise<Thread | null> {
    // Increment view count
    await prisma.thread.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return prisma.thread.findUnique({
      where: { id },
      include: {
        author: true,
        posts: {
          include: {
            author: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async create(data: {
    title: string;
    body: string;
    tags: string[];
    authorId: string;
  }): Promise<Thread> {
    const thread = await prisma.thread.create({
      data: {
        title: data.title,
        body: data.body,
        tags: data.tags,
        authorId: data.authorId,
      },
      include: {
        author: true,
      },
    });

    // Publish indexing job
    await queueService.publishThreadIndexing(thread.id);

    return thread;
  }

  async update(
    id: string,
    data: Partial<{ title: string; body: string; tags: string[]; status: ThreadStatus }>
  ): Promise<Thread> {
    const thread = await prisma.thread.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });

    // Re-index on update
    await queueService.publishThreadIndexing(thread.id);

    return thread;
  }

  async delete(id: string): Promise<void> {
    await prisma.thread.delete({
      where: { id },
    });
  }
}

export const threadService = new ThreadService();
