import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { RECENT_SEARCH_LIMIT } from '@shared/constants/ui.const';
import { RecentSearchesService } from './recent-searches.service';

describe('RecentSearchesService', () => {
  let service: RecentSearchesService;

  beforeEach(() => {
    service = TestBed.inject(RecentSearchesService);
  });

  it("mette in cima l'ultima ricerca", () => {
    service.add('one piece');
    service.add('maus');
    expect(service.recent()).toEqual(['maus', 'one piece']);
  });

  it('non ripete una ricerca già fatta, anche con altre maiuscole', () => {
    service.add('Maus');
    service.add('maus');
    expect(service.recent()).toEqual(['maus']);
  });

  it('ignora il testo vuoto', () => {
    service.add('   ');
    expect(service.recent()).toEqual([]);
  });

  it('ne tiene al massimo il limite', () => {
    for (let i = 0; i < RECENT_SEARCH_LIMIT + 3; i++) service.add(`q${i}`);
    expect(service.recent().length).toBe(RECENT_SEARCH_LIMIT);
  });

  it('ne toglie una o tutte', () => {
    service.add('a');
    service.add('b');
    service.remove('a');
    expect(service.recent()).toEqual(['b']);
    service.clear();
    expect(service.recent()).toEqual([]);
  });
});
