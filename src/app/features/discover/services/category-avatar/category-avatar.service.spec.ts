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
});
