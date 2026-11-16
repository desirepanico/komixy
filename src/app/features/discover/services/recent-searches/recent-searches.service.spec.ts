import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { RECENT_SEARCH_LIMIT, RECENT_SEARCH_SAMPLES } from '@shared/constants/ui.const';
import { RecentSearchesService } from './recent-searches.service';

describe('RecentSearchesService', () => {
  let service: RecentSearchesService;

  beforeEach(() => {
    service = TestBed.inject(RecentSearchesService);
  });

  it('parte con le ricerche di esempio', () => {
    expect(service.recent()).toEqual([...RECENT_SEARCH_SAMPLES]);
  });

  it("mette in cima l'ultima ricerca", () => {
    service.clear();
    service.add('one piece');
    service.add('maus');
    expect(service.recent()).toEqual(['maus', 'one piece']);
  });

  it('non ripete una ricerca già fatta, anche con altre maiuscole', () => {
    service.clear();
    service.add('Maus');
    service.add('maus');
    expect(service.recent()).toEqual(['maus']);
  });

  it('ignora il testo vuoto', () => {
    service.clear();
    service.add('   ');
    expect(service.recent()).toEqual([]);
  });

  it('ne tiene al massimo il limite', () => {
    service.clear();
    for (let i = 0; i < RECENT_SEARCH_LIMIT + 3; i++) service.add(`q${i}`);
    expect(service.recent().length).toBe(RECENT_SEARCH_LIMIT);
  });

  it('ne toglie una o tutte', () => {
    service.clear();
    service.add('a');
    service.add('b');
    service.remove('a');
    expect(service.recent()).toEqual(['b']);
    service.clear();
    expect(service.recent()).toEqual([]);
  });
});
