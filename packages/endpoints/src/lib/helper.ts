/**
 * Helpers pour les endpoints
 */

export function getRelativePath(fullPath: string, basePath: string): string {
  return fullPath.replace(basePath, '') || '/';
}