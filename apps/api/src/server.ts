import { createApp } from './app';
import { env, envConfig } from './shared/config/env';

const app = createApp();

const PORT = env.port;

app.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log(`📡 API running on: ${env.apiUrl}`);
  console.log(`🌍 Environment: ${env.nodeEnv}`);
  console.log(`📊 Health check: ${env.apiUrl}/health`);
  console.log(`🔌 Allowed origins: ${env.allowedOrigins.join(', ')}`);

  if (envConfig.isDevelopment()) {
    console.log('\n💡 Development mode - All CORS origins allowed');
  }
});
