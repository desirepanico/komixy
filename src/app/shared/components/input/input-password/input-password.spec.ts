import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputPassword } from './input-password';

@Component({
  imports: [InputPassword],
  template: `
    <app-input-password
      inputId="password"
      [(value)]="testo"
      [invalid]="invalid()"
      [touched]="touched()"
      (touch)="segnaTocco()"
    />
  `,
})
class Host {
  readonly testo = signal('');
  readonly invalid = signal(false);
  readonly touched = signal(false);
  readonly tocchi = signal(0);

  segnaTocco(): void {
    this.tocchi.update((n) => n + 1);
  }
}

describe('InputPassword', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const crea = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      campo: html.querySelector('input') as HTMLInputElement,
      occhio: html.querySelector('button') as HTMLButtonElement,
    };
  };

  it('viene creato', async () => {
    expect((await crea()).fixture).toBeTruthy();
  });

  it('nasconde la password per default', async () => {
    const { campo, occhio } = await crea();
    expect(campo.type).toBe('password');
    expect(campo.getAttribute('autocomplete')).toBe('current-password');
    expect(occhio.getAttribute('aria-pressed')).toBe('false');
  });

  it('mostra e nasconde la password con il bottone', async () => {
    const { fixture, campo, occhio } = await crea();
    occhio.click();
    await fixture.whenStable();
    expect(campo.type).toBe('text');
    expect(occhio.getAttribute('aria-pressed')).toBe('true');

    occhio.click();
    await fixture.whenStable();
    expect(campo.type).toBe('password');
    expect(occhio.getAttribute('aria-pressed')).toBe('false');
  });

  it('il bottone ha sempre la stessa etichetta tradotta', async () => {
    const { fixture, occhio } = await crea();
    expect(occhio.getAttribute('aria-label')).toBe('inputPassword.show');
    occhio.click();
    await fixture.whenStable();
    expect(occhio.getAttribute('aria-label')).toBe('inputPassword.show');
  });

  it('aggiorna il valore mentre si scrive', async () => {
    const { fixture, host, campo } = await crea();
    campo.value = '123456';
    campo.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.testo()).toBe('123456');
  });

  it('segnala che è stato toccato quando si esce dal campo', async () => {
    const { fixture, host, campo } = await crea();
    campo.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(host.tocchi()).toBe(1);
  });

  it('segnala l’errore e lo collega al messaggio quando è toccato e non valido', async () => {
    const { fixture, host, campo } = await crea();
    host.invalid.set(true);
    host.touched.set(true);
    await fixture.whenStable();
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(campo.getAttribute('aria-describedby')).toBe('password-error');
  });
});
