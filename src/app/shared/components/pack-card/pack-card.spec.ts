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
    [flippable]="girevole()"
    [decorative]="decorativa()"
    [compact]="compatta()"
  />`,
})
class Host {
  readonly carta = signal<RankingEntry>(entry());
  readonly scala = signal(1);
  readonly davanti = signal(true);
  readonly girevole = signal(false);
  readonly compatta = signal<boolean | undefined>(undefined);
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

  it('una carta che può girarsi col dorso in vista è ruotata', async () => {
    host().girevole.set(true);
    await fixture.whenStable();
    const ruotata = () => html.querySelector('.rotate-y-180.size-full');
    expect(ruotata()).toBeNull();
    host().davanti.set(false);
    await fixture.whenStable();
    expect(ruotata()).not.toBeNull();
  });

  it('una carta che non può girarsi è piatta, senza 3D che sfoca il testo', () => {
    expect(html.querySelector('.transform-3d')).toBeNull();
    expect(html.querySelector('.backface-hidden')).toBeNull();
    expect(carta().classList.contains('perspective-distant')).toBe(false);
    expect(carta().firstElementChild?.getAttribute('style') ?? '').not.toContain('transform');
  });

  it('una carta piatta col dorso in vista mostra il dorso e nasconde il fronte', async () => {
    host().davanti.set(false);
    await fixture.whenStable();
    const facce = Array.from(html.querySelectorAll('.absolute.inset-0')) as HTMLElement[];
    expect(facce[0].classList.contains('hidden')).toBe(true);
    expect(facce[1].classList.contains('hidden')).toBe(false);
  });

  it('il dorso mostra il logo di Komixy', () => {
    const logo = html.querySelector('[aria-hidden="true"] img') as HTMLImageElement;
    expect(logo.getAttribute('src')).toContain('/img/logo/komixy-logo.png');
    expect(logo.getAttribute('alt')).toBe('');
  });

  it('a grandezza naturale mostra titolo, autore e volume', () => {
    expect(html.textContent).toContain('One Piece');
    expect(html.querySelector('.text-5xl')).toBeNull();
  });

  it('una carta piccola mostra copertina e un numero di posizione grande, senza i testi illeggibili', async () => {
    host().scala.set(0.42);
    await fixture.whenStable();
    expect(html.querySelector('.text-5xl')?.textContent?.trim()).toBe('4');
    expect(html.textContent).not.toContain('One Piece');
    expect(html.querySelector('img[src*="one-piece"]')).not.toBeNull();
  });

  it('a grandezza naturale può essere forzata compatta, come nel ventaglio', async () => {
    host().compatta.set(true);
    await fixture.whenStable();
    expect(html.querySelector('.text-5xl')?.textContent?.trim()).toBe('4');
    expect(html.textContent).not.toContain('One Piece');
  });

  it('se è decorativa si nasconde ai lettori di schermo', async () => {
    expect(carta().getAttribute('aria-hidden')).toBeNull();
    host().decorativa.set(true);
    await fixture.whenStable();
    expect(carta().getAttribute('aria-hidden')).toBe('true');
  });
});
