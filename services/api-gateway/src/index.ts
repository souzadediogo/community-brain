import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`);
  console.log(`Environment: ${config.env}`);
});
