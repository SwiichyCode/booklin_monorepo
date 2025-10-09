/**
 * Configuration des variables d'environnement
 * Centralisée pour toute l'application
 */

export interface EnvConfig {
  // Server
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  apiUrl: string;
  logLevel: string;

  // Database
  databaseUrl: string;

  // Auth
  jwtSecret?: string;

  // External Services
  clerkSecretKey?: string;
  clerkWebhookSecret?: string;
  stripeSecretKey?: string;
  sendgridApiKey?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  googleMapsApiKey?: string;

  // CORS
  allowedOrigins: string[];
}

class EnvironmentConfig {
  private config: EnvConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validate();
  }

  private loadConfig(): EnvConfig {
    return {
      // Server
      nodeEnv: (process.env.NODE_ENV as EnvConfig['nodeEnv']) || 'development',
      port: parseInt(process.env.PORT || '4000', 10),
      apiUrl: process.env.API_URL || 'http://localhost:4000',
      logLevel: process.env.LOG_LEVEL || 'info',

      // Database
      databaseUrl: process.env.DATABASE_URL || '',

      // Auth
      jwtSecret: process.env.JWT_SECRET,

      // External Services
      clerkSecretKey: process.env.CLERK_SECRET_KEY,
      clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      sendgridApiKey: process.env.SENDGRID_API_KEY,
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,

      // CORS
      allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000'],
    };
  }

  private validate(): void {
    const requiredVars: (keyof EnvConfig)[] = ['databaseUrl'];

    const missing = requiredVars.filter((key) => !this.config[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }

  get(): EnvConfig {
    return this.config;
  }

  // Helpers
  isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  isTest(): boolean {
    return this.config.nodeEnv === 'test';
  }
}

// Singleton
export const env = new EnvironmentConfig().get();
export const envConfig = new EnvironmentConfig();
