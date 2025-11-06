import { prisma } from '../db/client';
import { User } from '@prisma/client';

export class UserService {
  async getAll(): Promise<Partial<User>[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        org: true,
        expertiseTags: true,
        createdAt: true,
        updatedAt: false,
      },
    });
  }

  async getById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        threads: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        posts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(data: {
    name: string;
    email: string;
    title?: string;
    org?: string;
    expertiseTags?: string[];
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      title: string | null;
      org: string | null;
      expertiseTags: string[];
    }>
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async findExperts(tags?: string[]): Promise<Partial<User>[]> {
    const where: any = {};

    if (tags && tags.length > 0) {
      where.expertiseTags = {
        hasSome: tags,
      };
    }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        org: true,
        expertiseTags: true,
      },
    });
  }
}

export const userService = new UserService();
