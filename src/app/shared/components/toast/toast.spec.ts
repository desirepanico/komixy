import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastService } from '../../services/toast/toast.service';
import { Toast } from './toast';

describe('Toast', () => {
  let fixture: ComponentFixture<Toast>;
  let service: ToastService;
  const html = () => fixture.nativeElement as HTMLElement;
  const messaggi = () => Array.from(html().querySelectorAll('div[aria-atomic="true"]'));

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

  it('le zone live esistono anche senza messaggi', () => {
    expect(html().querySelector('[role="status"][aria-live="polite"]')).not.toBeNull();
    expect(html().querySelector('[role="alert"][aria-live="assertive"]')).not.toBeNull();
  });

  it.each([
    ['error', '[role="alert"]'],
    ['warn', '[role="alert"]'],
    ['success', '[role="status"]'],
    ['info', '[role="status"]'],
  ] as const)('%s compare nella zona %s', async (severity, zona) => {
    service[severity]('a', 'b');
    await fixture.whenStable();
    expect(html().querySelector(zona)?.querySelectorAll('div[aria-atomic="true"]')).toHaveLength(1);
  });

  it('il messaggio è letto per intero', async () => {
    service.info('a', 'b');
    await fixture.whenStable();
    expect(messaggi()[0].getAttribute('aria-atomic')).toBe('true');
  });

  it('con il mouse sopra il messaggio non sparisce', async () => {
    vi.useFakeTimers();
    service.success('a', 'b');
    await vi.advanceTimersByTimeAsync(0);
    messaggi()[0].dispatchEvent(new Event('pointerenter'));
    await vi.advanceTimersByTimeAsync(10_000);
    expect(messaggi()).toHaveLength(1);
  });

  it('con il focus dentro il messaggio non sparisce e poi riparte', async () => {
    vi.useFakeTimers();
    service.success('a', 'b');
    await vi.advanceTimersByTimeAsync(0);
    messaggi()[0].dispatchEvent(new Event('focusin'));
    await vi.advanceTimersByTimeAsync(10_000);
    messaggi()[0].dispatchEvent(new Event('focusout'));
    await vi.advanceTimersByTimeAsync(10_000);
    await fixture.whenStable();
    expect(messaggi()).toEqual([]);
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
