import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserRole } from '../../models/user-role.model';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    service = TestBed.inject(SessionService);
  });

  it('parte senza utente e senza essere ospite', () => {
    expect(service.user()).toBeNull();
    expect(service.isGuest()).toBe(false);
  });

  it("riconosce l'ospite dal ruolo", () => {
    service.start({ id: 'guest', role: UserRole.Guest });
    expect(service.isGuest()).toBe(true);
  });

  it('un utente iscritto non è ospite', () => {
    service.start({ id: 'a@b.it', role: UserRole.User });
    expect(service.user()?.id).toBe('a@b.it');
    expect(service.isGuest()).toBe(false);
  });

  it('a fine sessione non resta nessun utente', () => {
    service.start({ id: 'guest', role: UserRole.Guest });
    service.end();
    expect(service.user()).toBeNull();
    expect(service.isGuest()).toBe(false);
  });
});
