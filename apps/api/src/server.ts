// apps/api/src/server.ts
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`🚀 Server on http://localhost:${env.PORT}`);
});
