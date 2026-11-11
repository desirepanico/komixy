// Completa jsdom con le API del browser che l'app usa e che jsdom non ha.
class ResizeObserverFinto {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver ??= ResizeObserverFinto;

window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList;

Element.prototype.scrollBy ??= () => {};

// jsdom non disegna: getContext esiste ma stampa un errore a ogni chiamata invece di restituire null
HTMLCanvasElement.prototype.getContext = () => null;
