import { defineConfig } from 'vitest/config';

// Ogni test riparte pulito: mock e variabili globali finte tornano come prima.
export default defineConfig({
  test: {
    restoreMocks: true,
    unstubGlobals: true,
  },
});
