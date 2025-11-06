import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'community-service',
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use('/api/v1', routes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not found',
      path: req.path,
    });
  });

  return app;
};
