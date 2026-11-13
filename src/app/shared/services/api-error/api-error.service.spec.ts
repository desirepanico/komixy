import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API_ERROR_MESSAGES } from '../../constants/api-error.const';
import { ApiErrorResponse } from '../../utils/api-error-response/api-error-response';
import { ToastService } from '../toast/toast.service';
import { ApiErrorService } from './api-error.service';

describe('ApiErrorService', () => {
  const fallback = { summary: 'default.summary', detail: 'default.detail' };
  let service: ApiErrorService;
  let error: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    service = TestBed.inject(ApiErrorService);
    error = vi.spyOn(TestBed.inject(ToastService), 'error');
  });

  it('con un codice noto mostra il messaggio di quel codice', () => {
    service.handle(new ApiErrorResponse(401, 'INVALID_CREDENTIALS', 'x'), fallback);
    expect(error).toHaveBeenCalledWith(
      'apiError.invalidCredentials.summaryKo',
      'apiError.invalidCredentials.detailKo',
    );
  });

  it('senza codice mostra il messaggio di default della chiamata', () => {
    service.handle(new ApiErrorResponse(500, '', 'x'), fallback);
    expect(error).toHaveBeenCalledWith('default.summary', 'default.detail');
  });

  it('con un codice sconosciuto mostra il messaggio di default', () => {
    service.handle(new ApiErrorResponse(400, 'CODICE_INVENTATO', 'x'), fallback);
    expect(error).toHaveBeenCalledWith('default.summary', 'default.detail');
  });

  it('un nome di proprietà di Object non è un codice', () => {
    service.handle(new ApiErrorResponse(400, 'toString', 'x'), fallback);
    expect(error).toHaveBeenCalledWith('default.summary', 'default.detail');
  });

  it('con null (un errore che non viene dall’API) mostra il messaggio di default', () => {
    service.handle(null, fallback);
    expect(error).toHaveBeenCalledWith('default.summary', 'default.detail');
  });

  it.each(Object.entries(API_ERROR_MESSAGES))('il codice %s usa il gruppo %s', (code, group) => {
    service.handle(new ApiErrorResponse(400, code, 'x'), fallback);
    expect(error).toHaveBeenCalledWith(`${group}.summaryKo`, `${group}.detailKo`);
  });
});
