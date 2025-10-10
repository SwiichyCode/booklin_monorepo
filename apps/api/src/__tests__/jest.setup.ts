import 'reflect-metadata';

// Configuration globale des timeouts
jest.setTimeout(10000);

// Mock console pour les tests (optionnel, décommenter si besoin)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.PORT = '4001';

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});
