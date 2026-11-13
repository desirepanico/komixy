import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GUEST_ID_HEADER } from '@shared/constants/api.const';
import { SessionService } from '@shared/services/session/session.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { baseUrlInterceptor } from '../base-url/base-url.interceptor';
import { guestIdInterceptor } from './guest-id.interceptor';

describe('guestIdInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let session: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([baseUrlInterceptor, guestIdInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionService);
  });

  it('un ospite manda il suo identificativo alle chiamate del backend', () => {
    http.get('/ranking').subscribe();
    const { request } = controller.expectOne((r) => r.url.endsWith('/ranking'));
    expect(request.headers.get(GUEST_ID_HEADER)).toBe(session.guestId());
    controller.verify();
  });

  it('un iscritto non lo manda', () => {
    session.setAuthenticated(true);
    http.get('/ranking').subscribe();
    const { request } = controller.expectOne((r) => r.url.endsWith('/ranking'));
    expect(request.headers.has(GUEST_ID_HEADER)).toBe(false);
    controller.verify();
  });

  it('non lo manda agli altri indirizzi', () => {
    http.get('./i18n/it.json').subscribe();
    const { request } = controller.expectOne('./i18n/it.json');
    expect(request.headers.has(GUEST_ID_HEADER)).toBe(false);
    controller.verify();
  });
});
