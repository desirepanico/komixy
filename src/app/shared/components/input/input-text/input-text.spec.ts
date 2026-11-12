import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { disabled, form, FormField, minLength, required } from '@angular/forms/signals';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputText } from './input-text';

@Component({
  imports: [InputText, FormField],
  template: `
    <app-input-text
      label="login.email"
      inputId="campo"
      type="email"
      placeholder="login.emailPlaceholder"
      autocomplete="email"
      [formField]="campoForm"
    />
  `,
})
class Host {
  readonly text = signal('');
  readonly off = signal(false);
  readonly campoForm = form(this.text, (path) => {
    required(path);
    minLength(path, 3);
    disabled(path, { when: () => this.off() });
  });
}

describe('InputText', () => {
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
    const message = () => html.querySelector('[role="alert"]')?.textContent?.trim();
    return { fixture, host: fixture.componentInstance, html, field, write, signOut, message };
  };

  it('viene creato', async () => {
    expect((await create()).fixture).toBeTruthy();
  });

  it('mostra il nome del campo collegato al campo', async () => {
    const { html, field } = await create();
    const label = html.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('login.email');
    expect(label.getAttribute('for')).toBe(field.id);
  });

  it('imposta id, tipo, segnaposto e autocomplete sul campo', async () => {
    const { field } = await create();
    expect(field.id).toBe('campo');
    expect(field.type).toBe('email');
    expect(field.getAttribute('placeholder')).toBe('login.emailPlaceholder');
    expect(field.getAttribute('autocomplete')).toBe('email');
  });

  it('aggiorna il modello mentre si scrive', async () => {
    const { host, write } = await create();
    await write('a@b.it');
    expect(host.text()).toBe('a@b.it');
  });

  it('mostra nel campo il value del modello', async () => {
    const { fixture, host, field } = await create();
    host.text.set('x@y.it');
    await fixture.whenStable();
    expect(field.value).toBe('x@y.it');
  });

  it('non mostra errori finché il campo non è stato toccato', async () => {
    const { field, message } = await create();
    expect(message()).toBeUndefined();
    expect(field.getAttribute('aria-invalid')).toBe('false');
    expect(field.getAttribute('aria-describedby')).toBeNull();
  });

  it('dopo l’uscita dal campo mostra il messaggio e lo collega al campo', async () => {
    const { html, field, signOut, message } = await create();
    await signOut();
    expect(message()).toBe('validation.required');
    expect(html.querySelector('[role="alert"]')?.id).toBe('campo-error');
    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(field.getAttribute('aria-describedby')).toBe('campo-error');
  });

  it('sceglie il messaggio dal tipo di errore', async () => {
    const { write, signOut, message } = await create();
    await write('ab');
    await signOut();
    expect(message()).toBe('validation.minLength');
  });

  it('toglie il messaggio quando il value diventa valido', async () => {
    const { field, write, signOut, message } = await create();
    await signOut();
    await write('abc');
    expect(message()).toBeUndefined();
    expect(field.getAttribute('aria-invalid')).toBe('false');
  });

  it('si disabilita quando il campo è disabilitato', async () => {
    const { fixture, host, field } = await create();
    host.off.set(true);
    await fixture.whenStable();
    expect(field.disabled).toBe(true);
  });
});
