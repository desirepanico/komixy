import { describe, expect, it, vi } from 'vitest';
import { stubImage } from './image-stub';

const aspetta = (esito: 'load' | 'error') =>
  new Promise<string>((resolve) => {
    stubImage(esito);
    const immagine = new Image();
    immagine.onload = () => resolve('load');
    immagine.onerror = () => resolve('error');
    immagine.src = '/img/prova.png';
  });

describe('stubImage', () => {
  it('di default l’immagine fallisce subito, invece di restare in attesa', async () => {
    stubImage();
    const immagine = new Image();
    const esito = new Promise<string>((resolve) => {
      immagine.onerror = () => resolve('error');
    });
    immagine.src = '/img/prova.png';
    expect(await esito).toBe('error');
  });

  it('con esito «load» l’immagine si carica', async () => {
    expect(await aspetta('load')).toBe('load');
  });

  it('con esito «error» l’immagine non si carica', async () => {
    expect(await aspetta('error')).toBe('error');
  });

  it('dopo il test la funzione globale viene ripristinata', () => {
    vi.unstubAllGlobals();
    expect(new Image()).toBeInstanceOf(HTMLImageElement);
  });
});
