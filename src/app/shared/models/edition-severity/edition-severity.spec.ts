import { describe, expect, it } from 'vitest';
import { editionSeverity } from './edition-severity';

describe('editionSeverity', () => {
  it("evidenzia in viola l'edizione limitata", () => {
    expect(editionSeverity('limited')).toBe('primary');
  });

  it('lascia neutre deluxe, variant e nessuna edizione', () => {
    expect(editionSeverity('deluxe')).toBe('secondary');
    expect(editionSeverity('variant')).toBe('secondary');
    expect(editionSeverity(null)).toBe('secondary');
  });
});
