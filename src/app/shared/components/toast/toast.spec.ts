import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastService } from '../../services/toast/toast.service';
import { Toast } from './toast';

describe('Toast', () => {
  let fixture: ComponentFixture<Toast>;
  let service: ToastService;
  const html = () => fixture.nativeElement as HTMLElement;
  const messaggi = () => Array.from(html().querySelectorAll('div[role]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Toast] }).compileComponents();
    fixture = TestBed.createComponent(Toast);
    service = TestBed.inject(ToastService);
    await fixture.whenStable();
  });

  // I timer finti non si ripristinano da soli
  afterEach(() => vi.useRealTimers());

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('senza messaggi non mostra nulla', () => {
    expect(messaggi()).toEqual([]);
  });

  it('mostra il titolo e il dettaglio del messaggio', async () => {
    service.error('login.serverError.summaryKo', 'login.serverError.detailKo');
    await fixture.whenStable();
    const [titolo, dettaglio] = Array.from(html().querySelectorAll('p'));
    expect(titolo.textContent?.trim()).toBe('login.serverError.summaryKo');
    expect(dettaglio.textContent?.trim()).toBe('login.serverError.detailKo');
  });

  it('inserisce i parametri nel testo', async () => {
    TestBed.inject(TranslocoService).setTranslation(
      { libreria: { summaryOk: 'Aggiunto', detailOk: '{{ title }} è nella libreria.' } },
      'it',
    );
    service.success('libreria.summaryOk', 'libreria.detailOk', { title: 'One Piece' });
    await fixture.whenStable();
    expect(html().querySelectorAll('p')[1].textContent?.trim()).toBe('One Piece è nella libreria.');
  });

  it.each([
    ['error', 'alert'],
    ['warn', 'alert'],
    ['success', 'status'],
    ['info', 'status'],
  ] as const)('%s è annunciato con role %s', async (severity, role) => {
    service[severity]('a', 'b');
    await fixture.whenStable();
    expect(messaggi()[0].getAttribute('role')).toBe(role);
  });

  it('l’icona è nascosta agli screen reader', async () => {
    service.info('a', 'b');
    await fixture.whenStable();
    expect(html().querySelector('ng-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('il bottone ha l’etichetta tradotta e chiude il messaggio', async () => {
    service.info('a', 'b');
    await fixture.whenStable();
    const chiudi = html().querySelector('button') as HTMLButtonElement;
    expect(chiudi.getAttribute('aria-label')).toBe('toast.close');
    chiudi.click();
    await fixture.whenStable();
    expect(messaggi()).toEqual([]);
  });

  it('il messaggio sparisce da solo', async () => {
    vi.useFakeTimers();
    service.success('a', 'b');
    await vi.advanceTimersByTimeAsync(10_000);
    await fixture.whenStable();
    expect(messaggi()).toEqual([]);
  });
});
