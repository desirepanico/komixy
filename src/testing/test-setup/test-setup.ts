import { beforeEach } from 'vitest';

// Completa jsdom con le API del browser che l'app usa e che jsdom non ha
class FakeResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver ??= FakeResizeObserver;

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList;

Element.prototype.scrollBy ??= () => {};

// La sessione e la busta stanno nello storage: ogni test riparte da un browser vuoto
beforeEach(() => localStorage.clear());
