import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RankingEntry } from '../../models/ranking-entry.model';
import { CardFan } from './card-fan';

const carte: RankingEntry[] = [1, 2, 3].map((rank) => ({
  rank,
  comic: {
    id: `w${rank}`,
    title: `Titolo ${rank}`,
    author: 'Autore',
    volume: rank,
    totalVolumes: 10,
    isSingleVolume: false,
    editionType: null,
    coverUrl: '/img/covers/one-piece.webp',
  },
}));

@Component({
  imports: [CardFan],
  template: `<app-card-fan [entries]="carte()" (cardSelect)="scelta($event)" />`,
})
class Host {
  readonly carte = signal(carte);
  scelta = vi.fn();
}

describe('CardFan', () => {
  let misura: (larghezza: number) => void;
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const bottoni = () => Array.from(html.querySelectorAll('button'));

  beforeEach(async () => {
    // Il ResizeObserver finto permette di decidere la larghezza che il ventaglio «misura»
    vi.stubGlobal(
      'ResizeObserver',
      class {
        public constructor(callback: ResizeObserverCallback) {
          misura = (larghezza) =>
            callback(
              [{ contentRect: { width: larghezza } } as ResizeObserverEntry],
              this as unknown as ResizeObserver,
            );
        }
        public observe(): void {}
        public unobserve(): void {}
        public disconnect(): void {}
      },
    );
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("ha un bottone per carta, da sinistra a destra: dall'ultima alla prima", () => {
    expect(bottoni().map((b) => b.getAttribute('aria-label'))).toEqual([
      'weeklyPack.cardLabel',
      'weeklyPack.cardLabel',
      'weeklyPack.cardLabel',
    ]);
    const ordine = Array.from(html.querySelectorAll('li')).map((li) => li.style.zIndex);
    expect(ordine).toEqual(['1', '2', '3']);
  });

  it('si apre a ventaglio dopo il primo disegno', () => {
    const inclinazioni = Array.from(html.querySelectorAll('li')).map((li) => li.style.transform);
    expect(inclinazioni).toEqual(['rotate(-50deg)', 'rotate(0deg)', 'rotate(50deg)']);
  });

  it('la prima carta sta sopra le altre', () => {
    const livelli = Array.from(html.querySelectorAll('li')).map((li) => Number(li.style.zIndex));
    expect(livelli[2]).toBe(Math.max(...livelli));
  });

  it('segnala la carta scelta', () => {
    bottoni()[2].click();
    expect(fixture.componentInstance.scelta).toHaveBeenCalledWith(carte[0]);
  });

  it('si ignora lo swipe di pagina sopra il ventaglio', () => {
    expect(html.querySelector('app-card-fan')?.hasAttribute('data-no-swipe')).toBe(true);
  });

  describe('grandezza', () => {
    const elenco = () => html.querySelector('ul') as HTMLElement;
    const scala = () => html.querySelector('app-pack-card > div')?.getAttribute('style') ?? '';

    it('su un telefono ha la grandezza base: 384×224 px e carte a scala 0,42', async () => {
      misura(337);
      await fixture.whenStable();
      expect(elenco().style.maxWidth).toBe('384px');
      expect(elenco().style.height).toBe('224px');
      expect(scala()).toContain('scale(0.42)');
    });

    it('su un tablet si ingrandisce con la larghezza disponibile', async () => {
      misura(860);
      await fixture.whenStable();
      expect(elenco().style.maxWidth).toBe('768px');
      expect(elenco().style.height).toBe('448px');
      expect(scala()).toContain('scale(0.84)');
    });

    it('non cresce oltre 2,2 volte, anche su uno schermo molto largo', async () => {
      misura(3000);
      await fixture.whenStable();
      expect(parseFloat(elenco().style.maxWidth)).toBeCloseTo(844.8, 1);
    });

    it('le carte restano centrate sul perno del ventaglio a ogni grandezza', async () => {
      misura(860);
      await fixture.whenStable();
      const carta = html.querySelector('li') as HTMLElement;
      // metà della larghezza della carta: 192 px × 0,84 ÷ 2
      expect(carta.style.marginLeft).toBe('-80.64px');
    });
  });
});
