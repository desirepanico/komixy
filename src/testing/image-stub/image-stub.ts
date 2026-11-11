import { vi } from 'vitest';

/** jsdom non carica le immagini: `new Image()` non emette mai load né error e chi le aspetta resta in attesa */
export function stubImage(esito: 'load' | 'error' = 'error'): void {
  vi.stubGlobal(
    'Image',
    class {
      crossOrigin = '';
      width = 200;
      height = 300;
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_url: string) {
        queueMicrotask(() => (esito === 'load' ? this.onload() : this.onerror()));
      }
    },
  );
}
