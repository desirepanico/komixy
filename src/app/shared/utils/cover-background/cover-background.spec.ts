import { describe, expect, it } from 'vitest';
import { coverBackground } from './cover-background';

describe('coverBackground', () => {
  it('usa la copertina se c’è', () => {
    expect(coverBackground({ coverUrl: '/img/a.webp' })).toBe('url(/img/a.webp)');
  });

  it('senza copertina disegna un fondale dal colore del volume', () => {
    expect(coverBackground({ coverUrl: '', coverHue: 300 })).toContain('hsl(300 55% 30%)');
  });

  it('senza copertina né colore usa il viola', () => {
    expect(coverBackground({ coverUrl: '' })).toContain('hsl(270 55% 30%)');
  });
});
