import type { Request, Response, NextFunction } from 'express';
import { envConfig } from '../../../../shared/config/env';

/**
 * Middleware de logging des requêtes HTTP
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  // Log après la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    };

    // Coloriser selon le status code
    const color = getStatusColor(res.statusCode);
    const emoji = getStatusEmoji(res.statusCode);

    if (envConfig.isDevelopment()) {
      console.log(
        `${emoji} ${color}${req.method}${reset} ${req.path} - ${res.statusCode} (${duration}ms)`
      );
    } else {
      // En production, logger en JSON pour parsing facile
      console.log(JSON.stringify(logData));
    }
  });

  next();
}

// Helpers pour coloriser les logs (development only)
const reset = '\x1b[0m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const blue = '\x1b[34m';

function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return red;
  if (statusCode >= 400) return yellow;
  if (statusCode >= 300) return blue;
  if (statusCode >= 200) return green;
  return reset;
}

function getStatusEmoji(statusCode: number): string {
  if (statusCode >= 500) return '❌';
  if (statusCode >= 400) return '⚠️';
  if (statusCode >= 300) return '🔄';
  if (statusCode >= 200) return '✅';
  return '📡';
}
