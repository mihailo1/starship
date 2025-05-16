import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

if (!globalThis.fetch) {
  require('whatwg-fetch');
}

vi.spyOn(console, 'error').mockImplementation((...args) => {
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
  // @ts-ignore
  return globalThis.__consoleErrorOriginal?.(...args);
});
