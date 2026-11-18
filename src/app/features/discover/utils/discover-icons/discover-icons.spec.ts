import { describe, expect, it } from 'vitest';
import { DISCOVER_FACET_ICONS, DISCOVER_OPTION_ICONS } from '@shared/constants/ui.const';
import { discoverIcons } from './discover-icons';

describe('discoverIcons', () => {
  const registered = Object.keys(discoverIcons());

  it('registra l’icona di ogni gruppo di filtri', () => {
    expect(Object.values(DISCOVER_FACET_ICONS).every((name) => registered.includes(name))).toBe(
      true,
    );
  });

  it('registra l’icona di ogni valore che ne ha una', () => {
    const names = Object.values(DISCOVER_OPTION_ICONS).flatMap((group) => Object.values(group));
    expect(names.every((name) => registered.includes(name))).toBe(true);
  });
});
