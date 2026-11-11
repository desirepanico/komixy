import { afterEach, describe, expect, it, vi } from 'vitest';
import { PACK_FALLBACK_PALETTE } from '../../../constants/ui.const';
import { ComicItem } from '../../../models/comic.model';
import { PackCard, PackSceneLabels } from '../../../models/pack.model';
import {
  drawCardBack,
  drawCardFront,
  drawGlow,
  drawPackFront,
  drawRoundedMask,
  drawSealMask,
  loadImage,
  readPalette,
} from './pack-art';

const etichette: PackSceneLabels = {
  volume: 'Vol.',
  singleVolume: 'Volume Unico',
  tagline: 'BOOSTER',
  editions: { variant: 'Cover variant', deluxe: 'Deluxe', limited: 'Limitata' },
};

const fumetto = (campi: Partial<ComicItem> = {}): ComicItem => ({
  id: 'w1',
  title: 'One Piece',
  author: 'Eiichiro Oda',
  volume: 107,
  totalVolumes: 110,
  isSingleVolume: false,
  editionType: null,
  coverUrl: '',
  ...campi,
});

const carta = (campi: Partial<ComicItem> = {}, rank = 1): PackCard => ({
  rank,
  comic: fumetto(campi),
  detailLink: ['/', 'comic', 'w1'],
});

const immagine = () => ({ width: 200, height: 300 }) as HTMLImageElement;

// Un contesto di disegno finto che si limita a ricordare cosa gli è stato chiesto
function contestoFinto() {
  const chiamate: { nome: string; args: unknown[] }[] = [];
  const stato: Record<string, unknown> = {};
  const ctx = new Proxy(
    {},
    {
      get(_obj, nome: string) {
        if (nome === 'measureText') return (testo: string) => ({ width: testo.length * 10 });
        if (nome === 'createLinearGradient' || nome === 'createRadialGradient') {
          return () => ({ addColorStop: vi.fn() });
        }
        if (nome in stato) return stato[nome];
        return (...args: unknown[]) => {
          chiamate.push({ nome, args });
        };
      },
      set(_obj, nome: string, valore: unknown) {
        stato[nome] = valore;
        return true;
      },
    },
  ) as unknown as CanvasRenderingContext2D;
  return {
    ctx,
    chiamate: (nome: string) => chiamate.filter((c) => c.nome === nome),
    testi: () => chiamate.filter((c) => c.nome === 'fillText').map((c) => String(c.args[0])),
  };
}

describe('readPalette', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--color-primary-500');
  });

  it('senza variabili CSS usa i colori di riserva', () => {
    expect(readPalette(document.documentElement).primary500).toBe(
      PACK_FALLBACK_PALETTE.primary500,
    );
  });

  it('se la variabile CSS esiste usa il suo valore', () => {
    document.documentElement.style.setProperty('--color-primary-500', ' #123456 ');
    expect(readPalette(document.documentElement).primary500).toBe('#123456');
  });
});

describe('drawPackFront', () => {
  const tavolozza = PACK_FALLBACK_PALETTE;

  it('disegna il marchio e la dicitura della busta', () => {
    const { ctx, chiamate, testi } = contestoFinto();
    drawPackFront(ctx, immagine(), etichette, tavolozza);
    expect(chiamate('drawImage')).toHaveLength(1);
    expect(testi()).toEqual(['BOOSTER']);
  });

  it('senza il marchio caricato disegna comunque la busta', () => {
    const { ctx, chiamate, testi } = contestoFinto();
    drawPackFront(ctx, null, etichette, tavolozza);
    expect(chiamate('drawImage')).toHaveLength(0);
    expect(testi()).toEqual(['BOOSTER']);
  });
});

describe('drawCardFront', () => {
  const tavolozza = PACK_FALLBACK_PALETTE;

  it('mostra posizione, titolo, autore e volume con il totale', () => {
    const { ctx, testi } = contestoFinto();
    drawCardFront(ctx, carta(), immagine(), etichette, tavolozza);
    expect(testi()).toEqual(['#', '1', 'One Piece', 'Eiichiro Oda', 'Vol. ', '107', ' / 110']);
  });

  it('per un volume unico mostra la dicitura invece del numero', () => {
    const { ctx, testi } = contestoFinto();
    drawCardFront(ctx, carta({ isSingleVolume: true, totalVolumes: null }), null, etichette, tavolozza);
    expect(testi()).toContain('Volume Unico');
    expect(testi()).not.toContain('107');
  });

  it("scrive il tag dell'edizione solo se c'è", () => {
    const senza = contestoFinto();
    drawCardFront(senza.ctx, carta(), null, etichette, tavolozza);
    expect(senza.testi()).not.toContain('Limitata');

    const con = contestoFinto();
    drawCardFront(con.ctx, carta({ editionType: 'limited' }), null, etichette, tavolozza);
    expect(con.testi()).toContain('Limitata');
  });

  it('disegna la copertina quando c’è e un segnaposto quando manca', () => {
    const con = contestoFinto();
    drawCardFront(con.ctx, carta(), immagine(), etichette, tavolozza);
    expect(con.chiamate('drawImage')).toHaveLength(1);

    const senza = contestoFinto();
    drawCardFront(senza.ctx, carta(), null, etichette, tavolozza);
    expect(senza.chiamate('drawImage')).toHaveLength(0);
  });

  it('taglia con i puntini un titolo troppo lungo', () => {
    const { ctx, testi } = contestoFinto();
    drawCardFront(ctx, carta({ title: 'T'.repeat(80) }), null, etichette, tavolozza);
    expect(testi().some((t) => t.endsWith('…'))).toBe(true);
  });
});

describe('drawCardBack', () => {
  it('disegna il logo al centro del dorso', () => {
    const { ctx, chiamate } = contestoFinto();
    drawCardBack(ctx, immagine(), PACK_FALLBACK_PALETTE);
    expect(chiamate('drawImage')).toHaveLength(1);
  });

  it('senza il logo caricato disegna comunque il dorso', () => {
    const { ctx, chiamate } = contestoFinto();
    drawCardBack(ctx, null, PACK_FALLBACK_PALETTE);
    expect(chiamate('drawImage')).toHaveLength(0);
    expect(chiamate('roundRect').length).toBeGreaterThan(0);
  });
});

describe('maschere', () => {
  it('la maschera arrotondata riempie di bianco un rettangolo con gli angoli smussati', () => {
    const { ctx, chiamate } = contestoFinto();
    drawRoundedMask(ctx, 240, 395);
    expect(chiamate('roundRect')).toHaveLength(1);
    expect(chiamate('fill')).toHaveLength(1);
  });

  it('corpo e lembo partono da punti diversi: il lembo dall’alto, il corpo dalla linea di strappo', () => {
    const corpo = contestoFinto();
    drawSealMask(corpo.ctx, 'body');
    const lembo = contestoFinto();
    drawSealMask(lembo.ctx, 'flap');
    const yCorpo = Number(corpo.chiamate('moveTo')[0].args[1]);
    const yLembo = Number(lembo.chiamate('moveTo')[0].args[1]);
    expect(yLembo).toBeLessThan(yCorpo);
  });

  it('entrambe le maschere si chiudono e si riempiono', () => {
    for (const parte of ['body', 'flap'] as const) {
      const { ctx, chiamate } = contestoFinto();
      drawSealMask(ctx, parte);
      expect(chiamate('closePath')).toHaveLength(1);
      expect(chiamate('fill')).toHaveLength(1);
    }
  });
});

describe('drawGlow', () => {
  it('riempie tutta la texture con un gradiente', () => {
    const { ctx, chiamate } = contestoFinto();
    drawGlow(ctx);
    expect(chiamate('fillRect')).toHaveLength(1);
  });
});

describe('loadImage', () => {
  it("restituisce l'immagine quando si carica", async () => {
    class ImmagineCheCarica {
      crossOrigin = '';
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_url: string) {
        queueMicrotask(() => this.onload());
      }
    }
    vi.stubGlobal('Image', ImmagineCheCarica);
    const immagine = await loadImage('/img/logo.png');
    expect(immagine).toBeInstanceOf(ImmagineCheCarica);
    expect(immagine?.crossOrigin).toBe('anonymous');
  });

  it('restituisce null quando non si carica', async () => {
    class ImmagineRotta {
      crossOrigin = '';
      onload: () => void = () => {};
      onerror: () => void = () => {};
      set src(_url: string) {
        queueMicrotask(() => this.onerror());
      }
    }
    vi.stubGlobal('Image', ImmagineRotta);
    expect(await loadImage('/img/rotta.png')).toBeNull();
  });
});
