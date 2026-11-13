import { describe, expect, it } from 'vitest';
import { apiUrl } from './api-url';

interface ComicListFilters {
  page: number;
  sort: string;
}

describe('apiUrl', () => {
  it('senza filtri restituisce il percorso', () => {
    expect(apiUrl('/auth/login')).toBe('/auth/login');
  });

  it('con i filtri aggiunge la query string', () => {
    const filters: ComicListFilters = { page: 2, sort: 'title' };
    expect(apiUrl('/comics', filters)).toBe('/comics?page=2&sort=title');
  });

  it('codifica i valori e gli array', () => {
    expect(apiUrl('/comics', { q: 'one piece', tag: ['a', 'b'] })).toBe(
      '/comics?q=one%20piece&tag%5B0%5D=a&tag%5B1%5D=b',
    );
  });
});
