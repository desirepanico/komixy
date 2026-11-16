import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { RecentSearchesService } from './recent-searches.service';

describe('RecentSearchesService', () => {
  let service: RecentSearchesService;

  beforeEach(() => {
    service = TestBed.inject(RecentSearchesService);
  });

  it('parte vuoto', () => {
    expect(service.items()).toEqual([]);
  });

  it('mette in cima l’ultima ricerca e non tiene doppioni', () => {
    service.add('Berserk');
    service.add('Maus');
    service.add('berserk');
    expect(service.items()).toEqual(['berserk', 'Maus']);
  });

  it('ignora il testo vuoto', () => {
    service.add('   ');
    expect(service.items()).toEqual([]);
  });

  it('ne tiene al massimo cinque', () => {
    ['a', 'b', 'c', 'd', 'e', 'f'].forEach((term) => service.add(term));
    expect(service.items()).toEqual(['f', 'e', 'd', 'c', 'b']);
  });

  it('toglie una ricerca o tutte', () => {
    service.add('a');
    service.add('b');
    service.remove('a');
    expect(service.items()).toEqual(['b']);
    service.clear();
    expect(service.items()).toEqual([]);
  });
});
