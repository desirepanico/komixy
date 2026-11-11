import { describe, expect, it } from 'vitest';
import { RankingEntry } from '../../../models/ranking-entry.model';
import { toPackCards } from './pack-cards';

const voce = (rank: number): RankingEntry => ({
  rank,
  comic: {
    id: `w${rank}`,
    title: `Titolo ${rank}`,
    author: 'Autore',
    volume: rank,
    totalVolumes: null,
    isSingleVolume: false,
    editionType: null,
    coverUrl: '',
  },
});

describe('toPackCards', () => {
  it('trasforma ogni voce della classifica in una carta, nello stesso ordine', () => {
    const carte = toPackCards([voce(1), voce(2)], (id) => ['/', 'comic', id]);
    expect(carte.map((c) => c.rank)).toEqual([1, 2]);
    expect(carte[1].comic.title).toBe('Titolo 2');
  });

  it('costruisce il link al dettaglio con la funzione ricevuta', () => {
    const carte = toPackCards([voce(3)], (id) => ['/', 'comic', id]);
    expect(carte[0].detailLink).toEqual(['/', 'comic', 'w3']);
  });

  it('senza voci non ci sono carte', () => {
    expect(toPackCards([], () => [])).toEqual([]);
  });
});
