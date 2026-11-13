import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { TIMEZONE_HEADER } from '@shared/constants/api.const';
import { beforeEach, describe, expect, it } from 'vitest';
import { timezoneInterceptor } from './timezone.interceptor';

describe('timezoneInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([timezoneInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('aggiunge il fuso orario dell’utente alle chiamate del backend', () => {
    http.get(`${environment.apiUrl}/comics`).subscribe();
    const request = controller.expectOne(`${environment.apiUrl}/comics`);
    expect(request.request.headers.get(TIMEZONE_HEADER)).toBe(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    controller.verify();
  });

  it('non lo manda agli altri indirizzi', () => {
    http.get('./i18n/it.json').subscribe();
    const request = controller.expectOne('./i18n/it.json');
    expect(request.request.headers.has(TIMEZONE_HEADER)).toBe(false);
    controller.verify();
  });
});
