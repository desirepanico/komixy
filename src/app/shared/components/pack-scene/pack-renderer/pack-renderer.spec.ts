import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { PackCard, PackSceneLabels, PackSceneMode, PackSceneState } from '../../../models/pack.model';
import type { Texture, WebGLRenderer } from 'three';
import { PackRenderer } from './pack-renderer';
import { stubImage } from '@testing/image-stub/image-stub';

// jsdom non ha WebGL: si sostituisce solo il renderer, il resto di three (scena, camera, mesh, raggi) è quello vero
const configurazione = { fallisce: false };

class GlFinto {
  outputColorSpace = '';
  toneMapping = 0;
  toneMappingExposure = 1;
  setPixelRatio = vi.fn();
  setSize = vi.fn();
  render = vi.fn();
  dispose = vi.fn();
}

let gl: GlFinto;

class PackRendererDiProva extends PackRenderer {
  protected override createGl(): WebGLRenderer {
    if (configurazione.fallisce) throw new Error('WebGL non disponibile');
    gl = new GlFinto();
    return gl as unknown as WebGLRenderer;
  }

  protected override createEnvironment(): Texture | null {
    return null;
  }
}

const etichette: PackSceneLabels = {
  volume: 'Vol.',
  singleVolume: 'Volume Unico',
  tagline: 'BOOSTER',
  editions: { variant: 'Cover variant', deluxe: 'Deluxe', limited: 'Limitata' },
};

const carta = (rank: number, edizione: 'limited' | null = null): PackCard => ({
  rank,
  detailLink: ['/', 'comic', `w${rank}`],
  comic: {
    id: `w${rank}`,
    title: `Titolo ${rank}`,
    author: 'Autore',
    volume: rank,
    totalVolumes: 10,
    isSingleVolume: false,
    editionType: edizione,
    coverUrl: `/copertina-${rank}.webp`,
  },
});

describe('PackRenderer', () => {
  const frames: FrameRequestCallback[] = [];
  let ora = 0;
  let canvas: HTMLCanvasElement;
  let stati: PackSceneState[];
  let strappoCompletato: Mock<() => void>;
  let renderer: PackRenderer | null;

  const avvia = (modo: PackSceneMode, quante = 2): PackRenderer => {
    renderer = new PackRendererDiProva({
      canvas,
      mode: modo,
      count: quante,
      labels: etichette,
      logo: null,
      wordmark: null,
      onState: (stato) => stati.push(stato),
      onTearComplete: strappoCompletato,
    });
    renderer.start();
    return renderer;
  };

  // Fa passare il tempo un fotogramma alla volta, come farebbe il browser
  const avanza = async (secondi: number) => {
    for (let t = 0; t < secondi; t += 0.016) {
      ora += 16;
      frames.shift()?.(ora);
      await Promise.resolve();
    }
  };

  const ultimo = () => stati[stati.length - 1];

  const evento = (tipo: string, x: number, y: number) =>
    Object.assign(new MouseEvent(tipo, { clientX: x, clientY: y, bubbles: true }), { pointerId: 1 });

  beforeEach(() => {
    frames.length = 0;
    ora = 0;
    stati = [];
    renderer = null;
    strappoCompletato = vi.fn<() => void>();
    configurazione.fallisce = false;
    vi.spyOn(performance, 'now').mockReturnValue(0);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    stubImage();
    canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'clientWidth', { value: 400 });
    Object.defineProperty(canvas, 'clientHeight', { value: 600 });
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 600 }) as DOMRect;
    canvas.setPointerCapture = vi.fn();
  });

  afterEach(() => {
    renderer?.dispose();
  });

  it("se il browser non può disegnare in 3D il costruttore lancia: il componente userà l'alternativa", () => {
    configurazione.fallisce = true;
    expect(() => avvia('open')).toThrow('WebGL non disponibile');
  });

  it("nel rito parte dall'introduzione e dopo un secondo aspetta lo strappo", async () => {
    avvia('open');
    expect(ultimo().phase).toBe('intro');
    await avanza(1.2);
    expect(ultimo().phase).toBe('closed');
  });

  it('in revisione parte dalla raccolta con tutte le carte girate', () => {
    avvia('review', 5);
    expect(ultimo()).toEqual({ phase: 'collection', revealed: 5, focus: null });
  });

  it('in revisione si sceglie una carta (0 = prima in classifica) e si torna alla raccolta', async () => {
    const scena = avvia('review', 5);
    scena.inspect(2);
    expect(ultimo()).toMatchObject({ phase: 'inspecting', focus: 2 });
    await avanza(0.7);
    scena.closeInspect();
    expect(ultimo()).toMatchObject({ phase: 'collection', focus: null });
  });

  it('una carta si può scegliere anche prima che arrivino i dati: non è rara e non rompe nulla', () => {
    const scena = avvia('review', 5);
    expect(() => scena.inspect(0)).not.toThrow();
    expect(ultimo().phase).toBe('inspecting');
  });

  it('non si sceglie una carta che non esiste', () => {
    const scena = avvia('review', 5);
    const prima = stati.length;
    scena.inspect(9);
    expect(stati).toHaveLength(prima);
  });

  it('durante il rito non si può scegliere una carta dalla raccolta', async () => {
    const scena = avvia('open');
    await avanza(1.2);
    const prima = stati.length;
    scena.inspect(0);
    expect(stati).toHaveLength(prima);
  });

  it("lo strappo da pulsante chiede l'apertura una sola volta e porta al mazzo", async () => {
    const scena = avvia('open');
    await avanza(1.2);
    scena.tearOpen();
    expect(ultimo().phase).toBe('tearing');
    await avanza(1.5);
    expect(strappoCompletato).toHaveBeenCalledOnce();
    expect(stati.map((s) => s.phase)).toContain('opening');
    await avanza(3);
    expect(ultimo().phase).toBe('deck');
    scena.tearOpen();
    expect(strappoCompletato).toHaveBeenCalledOnce();
  });

  it('non si strappa la busta prima della fine dell’introduzione', () => {
    const scena = avvia('open');
    scena.tearOpen();
    expect(ultimo().phase).toBe('intro');
  });

  it('non si gira una carta finché non arrivano i dati dal server', async () => {
    const scena = avvia('open');
    await avanza(1.2);
    scena.tearOpen();
    await avanza(5);
    expect(scena.hasCards).toBe(false);
    scena.flip();
    expect(ultimo().phase).toBe('deck');
  });

  it('il rito completo: gira, mette da parte, ventaglio e raccolta', async () => {
    const scena = avvia('open', 2);
    await avanza(1.2);
    scena.tearOpen();
    await avanza(5);
    scena.setCards([carta(1, 'limited'), carta(2)]);
    expect(scena.hasCards).toBe(true);

    scena.flip();
    expect(ultimo()).toMatchObject({ phase: 'flipping', focus: 1 });
    await avanza(1);
    expect(ultimo().phase).toBe('shown');

    scena.next();
    expect(ultimo().phase).toBe('moving');
    await avanza(1);
    expect(ultimo()).toMatchObject({ phase: 'deck', revealed: 1, focus: null });

    scena.flip();
    expect(ultimo()).toMatchObject({ phase: 'flipping', focus: 0 });
    await avanza(1);
    scena.next();
    await avanza(1);
    expect(ultimo().phase).toBe('finale');
    await avanza(2);
    expect(ultimo()).toMatchObject({ phase: 'collection', revealed: 2 });
  });

  it('trascinando la busta oltre la soglia si strappa', async () => {
    avvia('open');
    await avanza(1.2);
    canvas.dispatchEvent(evento('pointerdown', 200, 220));
    canvas.dispatchEvent(evento('pointermove', 420, 220));
    await avanza(0.3);
    canvas.dispatchEvent(evento('pointerup', 420, 220));
    expect(ultimo().phase).toBe('tearing');
    await avanza(1.5);
    expect(strappoCompletato).toHaveBeenCalledOnce();
  });

  it('trascinando poco la busta si richiude e resta da aprire', async () => {
    avvia('open');
    await avanza(1.2);
    canvas.dispatchEvent(evento('pointerdown', 200, 220));
    canvas.dispatchEvent(evento('pointermove', 215, 220));
    await avanza(0.3);
    canvas.dispatchEvent(evento('pointerup', 215, 220));
    await avanza(1);
    expect(ultimo().phase).toBe('closed');
    expect(strappoCompletato).not.toHaveBeenCalled();
  });

  it('un tocco sul mazzo gira la carta e un tocco sulla carta girata la mette da parte', async () => {
    const scena = avvia('open', 2);
    await avanza(1.2);
    scena.tearOpen();
    await avanza(5);
    scena.setCards([carta(1), carta(2)]);

    canvas.dispatchEvent(evento('pointerdown', 200, 280));
    canvas.dispatchEvent(evento('pointerup', 200, 280));
    expect(ultimo().phase).toBe('flipping');
    await avanza(1);
    canvas.dispatchEvent(evento('pointerdown', 200, 280));
    canvas.dispatchEvent(evento('pointerup', 200, 280));
    expect(ultimo().phase).toBe('moving');
  });

  it('un tocco su una carta della raccolta la mette in primo piano, un secondo la riporta indietro', async () => {
    avvia('review', 5);
    await avanza(0.5);
    canvas.dispatchEvent(evento('pointerdown', 200, 210));
    canvas.dispatchEvent(evento('pointerup', 200, 210));
    expect(ultimo().phase).toBe('inspecting');
    await avanza(0.7);
    canvas.dispatchEvent(evento('pointerdown', 200, 210));
    canvas.dispatchEvent(evento('pointerup', 200, 210));
    expect(ultimo().phase).toBe('collection');
  });

  it('un gesto che si sposta troppo non conta come tocco', async () => {
    avvia('review', 5);
    await avanza(0.5);
    const prima = stati.length;
    canvas.dispatchEvent(evento('pointerdown', 200, 210));
    canvas.dispatchEvent(evento('pointerup', 260, 210));
    expect(stati).toHaveLength(prima);
  });

  it('adatta il disegno alle dimensioni del canvas', () => {
    avvia('open');
    expect(gl.setSize).toHaveBeenCalledWith(400, 600, false);
  });

  it('disegna a ogni fotogramma', async () => {
    avvia('open');
    await avanza(0.1);
    expect(gl.render).toHaveBeenCalled();
  });

  it('smaltita, ferma i fotogrammi, libera il renderer e smette di ascoltare il puntatore', () => {
    const scena = avvia('review', 5);
    scena.dispose();
    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(gl.dispose).toHaveBeenCalled();
    const prima = stati.length;
    canvas.dispatchEvent(evento('pointerdown', 200, 210));
    canvas.dispatchEvent(evento('pointerup', 200, 210));
    expect(stati).toHaveLength(prima);
  });
});
