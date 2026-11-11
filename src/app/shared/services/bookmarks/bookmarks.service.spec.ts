import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SessionService } from '../session/session.service';
import { ToastService } from '../toast/toast.service';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let session: SessionService;
  let toast: ToastService;

  beforeEach(() => {
    service = TestBed.inject(BookmarksService);
    session = TestBed.inject(SessionService);
    toast = TestBed.inject(ToastService);
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

  it('un ospite riceve un toast informativo e non salva nulla', () => {
    service.toggle('a');
    expect(toast.toasts().map((t) => t.severity)).toEqual(['info']);
  });

  it('un iscritto riceve un toast di conferma quando aggiunge e quando toglie', () => {
    session.setAuthenticated(true);
    service.toggle('a');
    expect(toast.toasts().at(-1)?.severity).toBe('success');
    expect(toast.toasts().at(-1)?.summary).toBe('bookmark.added.summaryOk');

    service.toggle('a');
    expect(toast.toasts().at(-1)?.summary).toBe('bookmark.removed.summaryOk');
  });
});
