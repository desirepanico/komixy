import { describe, expect, it } from 'vitest';
import { safeReturnUrl } from './safe-return-url';

describe('safeReturnUrl', () => {
  it('accetta un percorso interno con query string', () => {
    expect(safeReturnUrl('/releases?x=1', '/discover')).toBe('/releases?x=1');
  });

  it('usa il fallback se manca', () => {
    expect(safeReturnUrl(null, '/discover')).toBe('/discover');
  });

  it('scarta gli indirizzi esterni', () => {
    expect(safeReturnUrl('https://sito.it', '/discover')).toBe('/discover');
    expect(safeReturnUrl('//sito.it', '/discover')).toBe('/discover');
    expect(safeReturnUrl('/\\sito.it', '/discover')).toBe('/discover');
  });
});
