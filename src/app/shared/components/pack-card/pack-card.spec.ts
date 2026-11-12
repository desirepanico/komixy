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
    [entry]="card()"
    [scale]="scale()"
    [faceUp]="faceUp()"
    [flippable]="flippable()"
    [decorative]="decorative()"
    [compact]="compact()"
  />`,
})
class Host {
  readonly card = signal<RankingEntry>(entry());
  readonly scale = signal(1);
  readonly faceUp = signal(true);
  readonly flippable = signal(false);
  readonly compact = signal<boolean | undefined>(undefined);
  readonly decorative = signal(false);
}

describe('PackCard', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const host = () => fixture.componentInstance;
  const card = () => html.querySelector('app-pack-card') as HTMLElement;

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
    host().card.set(entry({ isSingleVolume: true, totalVolumes: null, editionType: null }));
    await fixture.whenStable();
    expect(html.textContent).toContain('mangaCard.singleVolume');
    expect(html.textContent).not.toContain('mangaCard.editions');
  });

  it('la scala riduce le misure della carta', async () => {
    expect(card().style.width).toBe('192px');
    expect(card().style.height).toBe('320px');

    host().scale.set(0.5);
    await fixture.whenStable();
    expect(card().style.width).toBe('96px');
    expect(card().style.height).toBe('160px');
  });

  it('una carta che può girarsi col dorso in vista è ruotata', async () => {
    host().flippable.set(true);
    await fixture.whenStable();
    const rotated = () => html.querySelector('.rotate-y-180.size-full');
    expect(rotated()).toBeNull();
    host().faceUp.set(false);
    await fixture.whenStable();
    expect(rotated()).not.toBeNull();
  });

  it('una carta che non può girarsi è piatta, senza 3D che sfoca il testo', () => {
    expect(html.querySelector('.transform-3d')).toBeNull();
    expect(html.querySelector('.backface-hidden')).toBeNull();
    expect(card().classList.contains('perspective-distant')).toBe(false);
    expect(card().firstElementChild?.getAttribute('style') ?? '').not.toContain('transform');
  });

  it('una carta piatta col dorso in vista mostra il dorso e nasconde il fronte', async () => {
    host().faceUp.set(false);
    await fixture.whenStable();
    const faces = Array.from(html.querySelectorAll('.absolute.inset-0')) as HTMLElement[];
    expect(faces[0].classList.contains('hidden')).toBe(true);
    expect(faces[1].classList.contains('hidden')).toBe(false);
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
    host().scale.set(0.42);
    await fixture.whenStable();
    expect(html.querySelector('.text-5xl')?.textContent?.trim()).toBe('4');
    expect(html.textContent).not.toContain('One Piece');
    expect(html.querySelector('img[src*="one-piece"]')).not.toBeNull();
  });

  it('a grandezza naturale può essere forzata compatta, come nel ventaglio', async () => {
    host().compact.set(true);
    await fixture.whenStable();
    expect(html.querySelector('.text-5xl')?.textContent?.trim()).toBe('4');
    expect(html.textContent).not.toContain('One Piece');
  });

  it('se è decorativa si nasconde ai lettori di schermo', async () => {
    expect(card().getAttribute('aria-hidden')).toBeNull();
    host().decorative.set(true);
    await fixture.whenStable();
    expect(card().getAttribute('aria-hidden')).toBe('true');
  });
});
