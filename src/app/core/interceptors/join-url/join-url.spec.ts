import { describe, expect, it } from 'vitest';
import { joinUrl } from './join-url';

describe('joinUrl', () => {
  it.each([
    ['https://api.it', '/auth/login'],
    ['https://api.it/', '/auth/login'],
    ['https://api.it/', 'auth/login'],
    ['https://api.it', 'auth/login'],
    ['https://api.it//', '//auth/login'],
  ])('unisce %s e %s con una sola barra', (base, path) => {
    expect(joinUrl(base, path)).toBe('https://api.it/auth/login');
  });

  it('mantiene i segmenti del percorso del backend', () => {
    expect(joinUrl('https://api.it/v1/', '/comics')).toBe('https://api.it/v1/comics');
  });

  it('con un percorso vuoto finisce con la barra', () => {
    expect(joinUrl('https://api.it', '')).toBe('https://api.it/');
  });
});
