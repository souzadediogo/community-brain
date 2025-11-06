import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: '24h',
  },

  // Backend services
  services: {
    community: process.env.COMMUNITY_SERVICE_URL || 'http://localhost:4001',
    assistant: process.env.ASSISTANT_SERVICE_URL || 'http://localhost:5000',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};
