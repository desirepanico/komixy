import { describe, expect, it } from 'vitest';
import { editionSeverity } from './edition-severity';

describe('editionSeverity', () => {
  it("l'edizione limitata è viola (primary)", () => {
    expect(editionSeverity('limited')).toBe('primary');
  });

  it('deluxe e variant sono neutre (secondary)', () => {
    expect(editionSeverity('deluxe')).toBe('secondary');
    expect(editionSeverity('variant')).toBe('secondary');
  });

  it('senza edizione speciale è neutra (secondary)', () => {
    expect(editionSeverity(null)).toBe('secondary');
  });
});
