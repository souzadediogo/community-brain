import { PrismaClient, ThreadStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        title: 'Senior Software Engineer',
        org: 'TechCorp',
        expertiseTags: ['typescript', 'nodejs', 'databases'],
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Smith',
        email: 'bob@example.com',
        title: 'DevOps Engineer',
        org: 'CloudSys',
        expertiseTags: ['docker', 'kubernetes', 'aws'],
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carol Williams',
        email: 'carol@example.com',
        title: 'Full Stack Developer',
        org: 'StartupXYZ',
        expertiseTags: ['react', 'nodejs', 'postgresql'],
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Brown',
        email: 'david@example.com',
        title: 'Database Administrator',
        org: 'DataSolutions',
        expertiseTags: ['postgresql', 'mysql', 'redis'],
      },
    }),
    prisma.user.create({
      data: {
        name: 'Eve Martinez',
        email: 'eve@example.com',
        title: 'Frontend Developer',
        org: 'DesignCo',
        expertiseTags: ['react', 'typescript', 'css'],
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create threads with posts
  const thread1 = await prisma.thread.create({
    data: {
      title: 'How to optimize PostgreSQL queries?',
      body: 'I have a large table with millions of rows and queries are getting slow. What are the best practices for optimization?',
      tags: ['postgresql', 'performance', 'databases'],
      status: ThreadStatus.ANSWERED,
      viewCount: 142,
      authorId: users[0].id,
      posts: {
        create: [
          {
            content: 'Start by analyzing your query plans with EXPLAIN ANALYZE. This will show you where the bottlenecks are.',
            authorId: users[3].id,
            upvotes: 5,
          },
          {
            content: 'Make sure you have appropriate indexes on columns used in WHERE clauses and JOIN conditions. Also consider using partial indexes for frequently filtered data.',
            authorId: users[2].id,
            upvotes: 8,
            isAcceptedAnswer: true,
          },
          {
            content: 'Don\'t forget about connection pooling and adjusting PostgreSQL configuration parameters like shared_buffers and work_mem.',
            authorId: users[1].id,
            upvotes: 3,
          },
        ],
      },
    },
  });

  const thread2 = await prisma.thread.create({
    data: {
      title: 'Best practices for Docker multi-stage builds?',
      body: 'I want to reduce my Docker image sizes. What are the recommended patterns for multi-stage builds?',
      tags: ['docker', 'devops', 'containers'],
      status: ThreadStatus.OPEN,
      viewCount: 87,
      authorId: users[2].id,
      posts: {
        create: [
          {
            content: 'Use alpine-based images for smaller footprints. Start with a builder stage and then copy only the necessary artifacts to the final stage.',
            authorId: users[1].id,
            upvotes: 6,
          },
          {
            content: 'Here\'s a great article on the topic: https://docs.docker.com/build/building/multi-stage/',
            authorId: users[4].id,
            upvotes: 2,
          },
        ],
      },
    },
  });

  const thread3 = await prisma.thread.create({
    data: {
      title: 'TypeScript generics confusion',
      body: 'I\'m struggling to understand when to use generic constraints vs conditional types. Can someone explain the difference?',
      tags: ['typescript', 'generics', 'programming'],
      status: ThreadStatus.ANSWERED,
      viewCount: 215,
      authorId: users[4].id,
      posts: {
        create: [
          {
            content: 'Generic constraints limit what types can be passed to a generic, while conditional types allow you to create types based on conditions.',
            authorId: users[0].id,
            upvotes: 12,
            isAcceptedAnswer: true,
          },
          {
            content: 'Check out the TypeScript handbook section on advanced types. It has great examples.',
            authorId: users[2].id,
            upvotes: 4,
          },
        ],
      },
    },
  });

  const thread4 = await prisma.thread.create({
    data: {
      title: 'React state management in 2024',
      body: 'What are the current best practices for state management in React? Should I still use Redux or are there better alternatives?',
      tags: ['react', 'state-management', 'frontend'],
      status: ThreadStatus.OPEN,
      viewCount: 301,
      authorId: users[1].id,
      posts: {
        create: [
          {
            content: 'Context API with useReducer works great for many use cases. Only reach for Redux if you need the ecosystem.',
            authorId: users[4].id,
            upvotes: 7,
          },
          {
            content: 'I\'ve been loving Zustand for simpler state management. Much less boilerplate than Redux.',
            authorId: users[2].id,
            upvotes: 9,
          },
          {
            content: 'Don\'t forget about server state management with React Query or SWR. It handles a lot of common patterns.',
            authorId: users[0].id,
            upvotes: 11,
          },
        ],
      },
    },
  });

  const thread5 = await prisma.thread.create({
    data: {
      title: 'Kubernetes networking basics',
      body: 'I\'m new to Kubernetes and struggling with service networking. Can someone explain how pods communicate?',
      tags: ['kubernetes', 'networking', 'devops'],
      status: ThreadStatus.OPEN,
      viewCount: 93,
      authorId: users[3].id,
      posts: {
        create: [
          {
            content: 'Each pod gets its own IP address. Services provide stable endpoints for accessing pods. Look into ClusterIP, NodePort, and LoadBalancer service types.',
            authorId: users[1].id,
            upvotes: 5,
          },
        ],
      },
    },
  });

  console.log('Created threads with posts');
  console.log(`Thread 1: ${thread1.id}`);
  console.log(`Thread 2: ${thread2.id}`);
  console.log(`Thread 3: ${thread3.id}`);
  console.log(`Thread 4: ${thread4.id}`);
  console.log(`Thread 5: ${thread5.id}`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
