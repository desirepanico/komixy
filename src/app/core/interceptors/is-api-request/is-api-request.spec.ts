import { environment } from '@env/environment';
import { describe, expect, it } from 'vitest';
import { isApiRequest } from './is-api-request';

describe('isApiRequest', () => {
  it('è vero per un indirizzo del backend', () => {
    expect(isApiRequest(`${environment.apiUrl}/auth/login`)).toBe(true);
  });

  it.each([
    'https://altro-sito.it/auth/login',
    './i18n/it.json',
    '/auth/login',
    `${environment.apiUrl}x`,
  ])('è falso per %s', (url) => {
    expect(isApiRequest(url)).toBe(false);
  });
});
