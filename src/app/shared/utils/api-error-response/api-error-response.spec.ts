import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { ApiErrorResponse } from './api-error-response';

describe('ApiErrorResponse', () => {
  const fromBody = (status: number, error: unknown) =>
    ApiErrorResponse.fromHttpError(new HttpErrorResponse({ status, error }));

  it('è un Error con stato, codice e messaggio', () => {
    const error = new ApiErrorResponse(401, 'E401', 'Non autorizzato');
    expect(error).toBeInstanceOf(Error);
    expect([error.status, error.code, error.message]).toEqual([401, 'E401', 'Non autorizzato']);
  });

  it('legge codice e messaggio dalla busta ApiResponse', () => {
    const error = fromBody(401, { error: { code: 'E401', message: 'Credenziali' }, result: null });
    expect([error.status, error.code, error.message]).toEqual([401, 'E401', 'Credenziali']);
  });

  it('legge codice e messaggio anche da un corpo ApiError', () => {
    const error = fromBody(404, { code: 'NOT_FOUND', message: 'Non trovato' });
    expect([error.status, error.code, error.message]).toEqual([404, 'NOT_FOUND', 'Non trovato']);
  });

  it.each([
    null,
    undefined,
    'testo',
    42,
    {},
    { error: null },
    { error: { code: 7, message: 'x' } },
  ])('con il corpo %j usa lo stato, il messaggio di HttpClient e nessun codice', (body) => {
    const response = new HttpErrorResponse({ status: 500, error: body });
    const error = ApiErrorResponse.fromHttpError(response);
    expect([error.status, error.code, error.message]).toEqual([500, '', response.message]);
  });

  it('con un errore di rete (stato 0) non ha codice', () => {
    const error = fromBody(0, new ProgressEvent('error'));
    expect([error.status, error.code]).toEqual([0, '']);
  });
});
