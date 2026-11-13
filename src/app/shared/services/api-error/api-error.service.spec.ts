import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API_ERROR_MESSAGES } from '../../constants/api-error.const';
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

  it('con un ApiError dal codice noto mostra il messaggio di quel codice', () => {
    service.handle({ code: 'INVALID_CREDENTIALS', message: 'x' }, fallback);
    expect(error).toHaveBeenCalledWith(
      'apiError.invalidCredentials.summaryKo',
      'apiError.invalidCredentials.detailKo',
    );
  });

  it('legge il codice dal corpo di una risposta HTTP con un ApiError', () => {
    service.handle({ status: 404, error: { code: 'NOT_FOUND', message: 'x' } }, fallback);
    expect(error).toHaveBeenCalledWith('apiError.notFound.summaryKo', 'apiError.notFound.detailKo');
  });

  it('legge il codice anche dal corpo ApiResponse di una risposta HTTP', () => {
    const http = {
      status: 401,
      error: { error: { code: 'INVALID_CREDENTIALS', message: 'x' }, result: null },
    };
    service.handle(http, fallback);
    expect(error).toHaveBeenCalledWith(
      'apiError.invalidCredentials.summaryKo',
      'apiError.invalidCredentials.detailKo',
    );
  });

  it('senza codice mostra il messaggio di default della chiamata', () => {
    service.handle(new Error('rete'), fallback);
    expect(error).toHaveBeenCalledWith('default.summary', 'default.detail');
  });

  it('con un codice sconosciuto mostra il messaggio di default', () => {
    service.handle({ code: 'CODICE_INVENTATO', message: 'x' }, fallback);
    expect(error).toHaveBeenCalledWith('default.summary', 'default.detail');
  });

  it.each([
    null,
    undefined,
    'testo',
    42,
    {},
    { code: 7 },
    { error: 'testo' },
    { error: { code: '' } },
  ])('con %j (non è un errore con codice) mostra il messaggio di default', (value) => {
    service.handle(value, fallback);
    expect(error).toHaveBeenCalledWith('default.summary', 'default.detail');
  });

  it('un nome di proprietà di Object non è un codice', () => {
    service.handle({ code: 'toString', message: 'x' }, fallback);
    expect(error).toHaveBeenCalledWith('default.summary', 'default.detail');
  });

  it.each(Object.entries(API_ERROR_MESSAGES))('il codice %s usa il gruppo %s', (code, group) => {
    service.handle({ code, message: 'x' }, fallback);
    expect(error).toHaveBeenCalledWith(`${group}.summaryKo`, `${group}.detailKo`);
  });
});
