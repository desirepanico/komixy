import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '../../models/user-role.model';
import { SessionService } from '../session/session.service';
import { ToastService } from '../toast/toast.service';
=======
import { beforeEach, describe, expect, it } from 'vitest';
import { SessionService } from '../session/session.service';
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let session: SessionService;
<<<<<<< HEAD
  let toast: ToastService;
=======
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7

  beforeEach(() => {
    service = TestBed.inject(BookmarksService);
    session = TestBed.inject(SessionService);
<<<<<<< HEAD
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
=======
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
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  });
});
