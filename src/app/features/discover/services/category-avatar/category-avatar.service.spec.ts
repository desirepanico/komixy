import { TestBed } from '@angular/core/testing';
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

  it('il personaggio è un indirizzo dati SVG con la faccia DiceBear dentro', () => {
    const uri = service.avatar('shonen') ?? '';
    expect(uri.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
    const svg = decodeURIComponent(uri.slice(uri.indexOf(',') + 1));
    expect(svg).toContain('viewBox="0 0 200 200"');
    expect(svg).toContain('<image href="data:image/svg+xml');
    expect(svg).toContain('x="22" y="30" width="156" height="156"');
  });

  it('ogni categoria ha un personaggio diverso', () => {
    expect(service.avatar('shonen')).not.toBe(service.avatar('kodomo'));
  });
});
