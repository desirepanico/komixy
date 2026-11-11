export type SwipeDirection = 'left' | 'right';

/**
 * Riconosce uno swipe orizzontale dallo spostamento del dito.
 * Deve superare la soglia ed essere nettamente più orizzontale che verticale.
 */
export function detectSwipe(deltaX: number, deltaY: number, threshold = 70): SwipeDirection | null {
  const isHorizontal = Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
  if (!isHorizontal) return null;
  return deltaX < 0 ? 'left' : 'right';
}
