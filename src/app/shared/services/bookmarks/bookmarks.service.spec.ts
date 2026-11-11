import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '../../models/user-role.model';
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
    vi.spyOn(toast, 'info');
  });

  it('parte senza segnalibri', () => {
    expect(service.ids()).toEqual([]);
    expect(service.isBookmarked('w1')).toBe(false);
  });

  it('aggiunge un fumetto in lista e lo toglie al secondo tocco', () => {
    session.start({ id: 'a@b.it', role: UserRole.User });
    service.toggle('w1');
    expect(service.isBookmarked('w1')).toBe(true);
    service.toggle('w1');
    expect(service.isBookmarked('w1')).toBe(false);
  });

  it('tiene più segnalibri insieme', () => {
    session.start({ id: 'a@b.it', role: UserRole.User });
    service.toggle('w1');
    service.toggle('w2');
    expect(service.ids()).toEqual(['w1', 'w2']);
  });

  it("l'ospite non può aggiungere: resta bloccato e riceve l'invito a iscriversi", () => {
    session.start({ id: 'guest', role: UserRole.Guest });
    expect(service.locked()).toBe(true);
    service.toggle('w1');
    expect(service.isBookmarked('w1')).toBe(false);
    expect(toast.info).toHaveBeenCalledWith(
      'bookmark.guestLocked.summaryInfo',
      'bookmark.guestLocked.detailInfo',
    );
  });

  it('un utente iscritto non è bloccato e non riceve inviti', () => {
    session.start({ id: 'a@b.it', role: UserRole.User });
    service.toggle('w1');
    expect(service.locked()).toBe(false);
    expect(toast.info).not.toHaveBeenCalled();
  });
});
