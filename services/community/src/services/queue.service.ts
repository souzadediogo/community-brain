import * as amqp from 'amqplib';
import { config } from '../config';

class QueueService {
  private connection: any = null;
  private channel: any = null;

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(config.rabbitmq.url);
      this.channel = await this.connection.createChannel();

      // Declare queues with durable flag
      await this.channel.assertQueue('indexing.threads', { durable: true });
      await this.channel.assertQueue('indexing.posts', { durable: true });

      console.log('✅ Connected to RabbitMQ');
      console.log('  - Queue: indexing.threads');
      console.log('  - Queue: indexing.posts');
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async publishThreadIndexing(threadId: string): Promise<void> {
    if (!this.channel) {
      console.warn('Queue not connected, skipping thread indexing job');
      return;
    }

    try {
      const message = JSON.stringify({
        type: 'thread',
        threadId,
        timestamp: new Date().toISOString(),
      });

      this.channel.sendToQueue(
        'indexing.threads',
        Buffer.from(message),
        { persistent: true }
      );

      console.log(`📤 Published thread indexing job: ${threadId}`);
    } catch (error) {
      console.error('Failed to publish thread indexing job:', error);
    }
  }

  async publishPostIndexing(postId: string): Promise<void> {
    if (!this.channel) {
      console.warn('Queue not connected, skipping post indexing job');
      return;
    }

    try {
      const message = JSON.stringify({
        type: 'post',
        postId,
        timestamp: new Date().toISOString(),
      });

      this.channel.sendToQueue(
        'indexing.posts',
        Buffer.from(message),
        { persistent: true }
      );

      console.log(`📤 Published post indexing job: ${postId}`);
    } catch (error) {
      console.error('Failed to publish post indexing job:', error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error);
    }
  }
}

export const queueService = new QueueService();
