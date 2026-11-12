// Completa jsdom con le API del browser che l'app usa e che jsdom non ha.
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
