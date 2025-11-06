const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'community-service' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Community Service running on port ${PORT}`);
});
