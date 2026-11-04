import { describe, expect, it } from 'vitest';
import { detectSwipe } from './detect-swipe';

describe('detectSwipe', () => {
  it('riconosce uno swipe verso sinistra', () => {
    expect(detectSwipe(-120, 10)).toBe('left');
  });

  it('riconosce uno swipe verso destra', () => {
    expect(detectSwipe(120, -10)).toBe('right');
  });

  it('ignora i gesti sotto la soglia', () => {
    expect(detectSwipe(40, 0)).toBeNull();
  });

  it('ignora i gesti troppo verticali', () => {
    expect(detectSwipe(100, 90)).toBeNull();
  });

  it('usa la soglia personalizzata', () => {
    expect(detectSwipe(-40, 0, 30)).toBe('left');
  });
});
