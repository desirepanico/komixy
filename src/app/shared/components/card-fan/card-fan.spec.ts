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
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const bottoni = () => Array.from(html.querySelectorAll('button'));

  beforeEach(async () => {
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
});
