import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { RankingEntry } from '../../models/ranking-entry.model';
import { PackCard } from './pack-card';

const entry = (modifiche: Partial<RankingEntry['comic']> = {}): RankingEntry => ({
  rank: 4,
  comic: {
    id: 'w4',
    title: 'One Piece',
    author: 'Eiichiro Oda',
    volume: 100,
    totalVolumes: 110,
    isSingleVolume: false,
    editionType: 'variant',
    coverUrl: '/img/covers/one-piece.webp',
    ...modifiche,
  },
});

@Component({
  imports: [PackCard],
  template: `<app-pack-card
    [entry]="carta()"
    [scale]="scala()"
    [faceUp]="davanti()"
    [decorative]="decorativa()"
  />`,
})
class Host {
  readonly carta = signal<RankingEntry>(entry());
  readonly scala = signal(1);
  readonly davanti = signal(true);
  readonly decorativa = signal(false);
}

describe('PackCard', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const host = () => fixture.componentInstance;
  const carta = () => html.querySelector('app-pack-card') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(host()).toBeTruthy();
  });

  it('mostra posizione, titolo, autore, volume ed edizione', () => {
    expect(html.textContent).toContain('4');
    expect(html.textContent).toContain('One Piece');
    expect(html.textContent).toContain('Eiichiro Oda');
    expect(html.textContent).toContain('100');
    expect(html.textContent).toContain('/ 110');
    expect(html.textContent).toContain('mangaCard.editions.variant');
  });

  it('per un volume unico scrive la dicitura al posto del numero', async () => {
    host().carta.set(entry({ isSingleVolume: true, totalVolumes: null, editionType: null }));
    await fixture.whenStable();
    expect(html.textContent).toContain('mangaCard.singleVolume');
    expect(html.textContent).not.toContain('mangaCard.editions');
  });

  it('la scala riduce le misure della carta', async () => {
    expect(carta().style.width).toBe('192px');
    expect(carta().style.height).toBe('320px');

    host().scala.set(0.5);
    await fixture.whenStable();
    expect(carta().style.width).toBe('96px');
    expect(carta().style.height).toBe('160px');
  });

  it('col dorso in vista la carta è girata', async () => {
    const girevole = () => html.querySelector('.rotate-y-180.size-full');
    expect(girevole()).toBeNull();
    host().davanti.set(false);
    await fixture.whenStable();
    expect(girevole()).not.toBeNull();
  });

  it('il dorso mostra il logo di Komixy', () => {
    const logo = html.querySelector('[aria-hidden="true"] img') as HTMLImageElement;
    expect(logo.getAttribute('src')).toContain('/img/logo/komixy-logo.png');
    expect(logo.getAttribute('alt')).toBe('');
  });

  it('se è decorativa si nasconde ai lettori di schermo', async () => {
    expect(carta().getAttribute('aria-hidden')).toBeNull();
    host().decorativa.set(true);
    await fixture.whenStable();
    expect(carta().getAttribute('aria-hidden')).toBe('true');
  });
});
