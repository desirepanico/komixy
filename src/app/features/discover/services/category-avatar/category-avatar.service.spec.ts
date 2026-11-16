import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { CategoryAvatarService } from './category-avatar.service';

describe('CategoryAvatarService', () => {
  let service: CategoryAvatarService;

  beforeEach(() => {
    service = TestBed.inject(CategoryAvatarService);
  });

  it('disegna un personaggio per ogni categoria dei manga', () => {
    for (const category of ['shonen', 'kodomo', 'shojo', 'seinen', 'josei']) {
      expect(service.avatar(category)).not.toBeNull();
    }
  });

  it('per una categoria sconosciuta non c’è nessun personaggio', () => {
    expect(service.avatar('noir')).toBeNull();
  });

  it('ricorda il personaggio già disegnato', () => {
    expect(service.avatar('shonen')).toBe(service.avatar('shonen'));
  });

  it('il personaggio è un SVG con la faccia dentro, senza il testo della licenza', () => {
    const html = TestBed.inject(DomSanitizer).sanitize(1, service.avatar('shonen')) ?? '';
    expect(html).toContain('viewBox="0 0 200 200"');
    expect(html).toContain('x="22" y="30" width="156" height="156"');
    expect(html).not.toContain('<!--');
    expect(html).not.toContain('<metadata');
  });

  it('ogni personaggio ha i suoi id, così più SVG nella pagina non si confondono', () => {
    const ids = (category: string): string[] =>
      Array.from(
        (TestBed.inject(DomSanitizer).sanitize(1, service.avatar(category)) ?? '').matchAll(
          /id="([^"]+)"/g,
        ),
        (m) => m[1],
      );
    const shared = ids('shonen').filter((id) => ids('kodomo').includes(id));
    expect(shared).toEqual([]);
  });
});
