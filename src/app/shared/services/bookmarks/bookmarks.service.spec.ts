import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SessionService } from '../session/session.service';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let session: SessionService;

  beforeEach(() => {
    service = TestBed.inject(BookmarksService);
    session = TestBed.inject(SessionService);
  });

  it('un iscritto aggiunge e toglie un fumetto dalla lista', () => {
    session.setAuthenticated(true);
    expect(service.toggle('a')).toBe(true);
    expect(service.isSaved('a')).toBe(true);
    expect(service.savedCount()).toBe(1);

    service.toggle('a');
    expect(service.isSaved('a')).toBe(false);
    expect(service.savedCount()).toBe(0);
  });

  it('può avere più fumetti in lista insieme', () => {
    session.setAuthenticated(true);
    service.toggle('a');
    service.toggle('b');
    expect(service.isSaved('a')).toBe(true);
    expect(service.isSaved('b')).toBe(true);
    expect(service.savedCount()).toBe(2);
  });

  it('un ospite non salva nulla', () => {
    expect(service.canSave()).toBe(false);
    expect(service.toggle('a')).toBe(false);
    expect(service.isSaved('a')).toBe(false);
  });
});
