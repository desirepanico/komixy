/**
 * Elementi su cui un gesto non deve essere considerato uno swipe di pagina.
 * Link e bottoni non sono qui: le card sono link e coprono quasi tutta la pagina.
 */
export const IGNORED_TARGETS = [
  'input',
  'textarea',
  'select',
  '[role="slider"]',
  '[data-no-swipe]',
].join(',');
