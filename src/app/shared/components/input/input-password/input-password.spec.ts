import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputPassword } from './input-password';

@Component({
  imports: [InputPassword, FormField],
  template: `
    <app-input-password
      label="login.password"
      inputId="password"
      placeholder="login.passwordPlaceholder"
      [formField]="campoForm"
    />
  `,
})
class Host {
  readonly text = signal('');
  readonly campoForm = form(this.text, (path) => {
    required(path);
    minLength(path, 6);
  });
}

describe('InputPassword', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const create = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    const field = html.querySelector('input') as HTMLInputElement;
    const write = async (value: string) => {
      field.value = value;
      field.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const signOut = async () => {
      field.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    return {
      fixture,
      host: fixture.componentInstance,
      html,
      field,
      eye: html.querySelector('button') as HTMLButtonElement,
      write,
      signOut,
      message: () => html.querySelector('[role="alert"]')?.textContent?.trim(),
    };
  };

  it('viene creato', async () => {
    expect((await create()).fixture).toBeTruthy();
  });

  it('mostra il nome del campo', async () => {
    expect((await create()).html.querySelector('label')?.textContent?.trim()).toBe(
      'login.password',
    );
  });

  it('mostra il segnaposto tradotto', async () => {
    const { field } = await create();
    expect(field.getAttribute('placeholder')).toBe('login.passwordPlaceholder');
  });

  it('nasconde la password per default', async () => {
    const { field, eye } = await create();
    expect(field.type).toBe('password');
    expect(field.getAttribute('autocomplete')).toBe('current-password');
    expect(eye.getAttribute('aria-pressed')).toBe('false');
  });

  it('mostra e nasconde la password con il bottone', async () => {
    const { fixture, field, eye } = await create();
    eye.click();
    await fixture.whenStable();
    expect(field.type).toBe('text');
    expect(eye.getAttribute('aria-pressed')).toBe('true');

    eye.click();
    await fixture.whenStable();
    expect(field.type).toBe('password');
    expect(eye.getAttribute('aria-pressed')).toBe('false');
  });

  it('il bottone ha sempre la stessa etichetta tradotta', async () => {
    const { fixture, eye } = await create();
    expect(eye.getAttribute('aria-label')).toBe('inputPassword.show');
    eye.click();
    await fixture.whenStable();
    expect(eye.getAttribute('aria-label')).toBe('inputPassword.show');
  });

  it('aggiorna il modello mentre si scrive', async () => {
    const { host, write } = await create();
    await write('123456');
    expect(host.text()).toBe('123456');
  });

  it('non mostra errori finché il campo non è stato toccato', async () => {
    const { field, message } = await create();
    expect(message()).toBeUndefined();
    expect(field.getAttribute('aria-invalid')).toBe('false');
  });

  it('dopo l’uscita dal campo mostra il messaggio e lo collega al campo', async () => {
    const { html, field, signOut, message } = await create();
    await signOut();
    expect(message()).toBe('validation.required');
    expect(html.querySelector('[role="alert"]')?.id).toBe('password-error');
    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(field.getAttribute('aria-describedby')).toBe('password-error');
  });

  it('sceglie il messaggio dal tipo di errore', async () => {
    const { write, signOut, message } = await create();
    await write('123');
    await signOut();
    expect(message()).toBe('validation.minLength');
  });
});
