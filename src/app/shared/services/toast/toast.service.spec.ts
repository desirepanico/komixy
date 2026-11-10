import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TOAST_DURATION_MS, TOAST_MAX_VISIBLE } from '../../constants/ui.const';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(ToastService);
  });

  // I timer finti non si ripristinano da soli
  afterEach(() => vi.useRealTimers());

  it('parte senza messaggi', () => {
    expect(service.toasts()).toEqual([]);
  });

  it.each(['success', 'info', 'warn', 'error'] as const)(
    '%s aggiunge un messaggio con quella severity, il titolo e il dettaglio',
    (severity) => {
      service[severity]('titolo', 'dettaglio');
      expect(service.toasts()).toEqual([
        { id: 0, severity, summary: 'titolo', detail: 'dettaglio' },
      ]);
    },
  );

  it('traduce titolo e dettaglio', () => {
    TestBed.inject(TranslocoService).setTranslation(
      { libreria: { summaryOk: 'Aggiunto', detailOk: 'È nella libreria.' } },
      'it',
    );
    service.success('libreria.summaryOk', 'libreria.detailOk');
    expect(service.toasts()[0]).toMatchObject({
      summary: 'Aggiunto',
      detail: 'È nella libreria.',
    });
  });

  it('dà un id diverso a ogni messaggio', () => {
    service.info('a', 'd');
    service.info('b', 'd');
    const [primo, secondo] = service.toasts();
    expect(primo.id).not.toBe(secondo.id);
  });

  it('dismiss toglie solo il messaggio indicato', () => {
    service.info('a', 'd');
    service.info('b', 'd');
    service.dismiss(service.toasts()[0].id);
    expect(service.toasts().map((toast) => toast.summary)).toEqual(['b']);
  });

  it('il messaggio sparisce da solo dopo la durata della sua severity', () => {
    service.success('a', 'd');
    vi.advanceTimersByTime(TOAST_DURATION_MS.success - 1);
    expect(service.toasts()).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(service.toasts()).toEqual([]);
  });

  it('un errore resta più a lungo di una conferma', () => {
    expect(TOAST_DURATION_MS.error).toBeGreaterThan(TOAST_DURATION_MS.success);
  });

  it('oltre il limite toglie il messaggio più vecchio', () => {
    for (let i = 0; i <= TOAST_MAX_VISIBLE; i++) service.info(`m${i}`, 'd');
    expect(service.toasts()).toHaveLength(TOAST_MAX_VISIBLE);
    expect(service.toasts()[0].summary).toBe('m1');
  });
});
