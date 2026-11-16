import { describe, expect, it } from 'vitest';
import { shortcutModifier } from './shortcut-modifier';

describe('shortcutModifier', () => {
  it('su Mac, iPhone e iPad è ⌘', () => {
    for (const platform of ['MacIntel', 'iPhone', 'iPad']) {
      expect(shortcutModifier(platform)).toBe('⌘');
    }
  });

  it('su Windows e Linux è Ctrl', () => {
    for (const platform of ['Win32', 'Linux x86_64']) {
      expect(shortcutModifier(platform)).toBe('Ctrl');
    }
  });
});
