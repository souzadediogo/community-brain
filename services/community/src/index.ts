import { createApp } from './app';
import { queueService } from './services/queue.service';
import { config } from './config';

async function start() {
  try {
    console.log('Starting Community Service...');

    // Connect to RabbitMQ
    try {
      await queueService.connect();
    } catch (error) {
      console.warn('Warning: RabbitMQ connection failed. Service will continue without queue functionality.');
    }

    // Start Express server
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`\n✅ Community Service running on port ${config.port}`);
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Health: http://localhost:${config.port}/health`);
      console.log(`   API: http://localhost:${config.port}/api/v1`);
    });
  } catch (error) {
    console.error('Failed to start Community Service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await queueService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await queueService.disconnect();
  process.exit(0);
});

start().catch(console.error);
