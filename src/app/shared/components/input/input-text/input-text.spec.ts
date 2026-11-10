import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { disabled, form, minLength, required } from '@angular/forms/signals';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputText } from './input-text';

@Component({
  imports: [InputText],
  template: `
    <app-input-text
      label="login.email"
      inputId="campo"
      type="email"
      placeholder="login.emailPlaceholder"
      autocomplete="email"
      [field]="campoForm"
    />
  `,
})
class Host {
  readonly testo = signal('');
  readonly spento = signal(false);
  readonly campoForm = form(this.testo, (path) => {
    required(path);
    minLength(path, 3);
    disabled(path, { when: () => this.spento() });
  });
}

describe('InputText', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const crea = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    const campo = html.querySelector('input') as HTMLInputElement;
    const scrivi = async (valore: string) => {
      campo.value = valore;
      campo.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const esci = async () => {
      campo.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    const messaggio = () => html.querySelector('[role="alert"]')?.textContent?.trim();
    return { fixture, host: fixture.componentInstance, html, campo, scrivi, esci, messaggio };
  };

  it('viene creato', async () => {
    expect((await crea()).fixture).toBeTruthy();
  });

  it('mostra il nome del campo collegato al campo', async () => {
    const { html, campo } = await crea();
    const label = html.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('login.email');
    expect(label.getAttribute('for')).toBe(campo.id);
  });

  it('imposta id, tipo, segnaposto e autocomplete sul campo', async () => {
    const { campo } = await crea();
    expect(campo.id).toBe('campo');
    expect(campo.type).toBe('email');
    expect(campo.getAttribute('placeholder')).toBe('login.emailPlaceholder');
    expect(campo.getAttribute('autocomplete')).toBe('email');
  });

  it('aggiorna il modello mentre si scrive', async () => {
    const { host, scrivi } = await crea();
    await scrivi('a@b.it');
    expect(host.testo()).toBe('a@b.it');
  });

  it('mostra nel campo il valore del modello', async () => {
    const { fixture, host, campo } = await crea();
    host.testo.set('x@y.it');
    await fixture.whenStable();
    expect(campo.value).toBe('x@y.it');
  });

  it('non mostra errori finché il campo non è stato toccato', async () => {
    const { campo, messaggio } = await crea();
    expect(messaggio()).toBeUndefined();
    expect(campo.getAttribute('aria-invalid')).toBe('false');
    expect(campo.getAttribute('aria-describedby')).toBeNull();
  });

  it('dopo l’uscita dal campo mostra il messaggio e lo collega al campo', async () => {
    const { html, campo, esci, messaggio } = await crea();
    await esci();
    expect(messaggio()).toBe('validation.required');
    expect(html.querySelector('[role="alert"]')?.id).toBe('campo-error');
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(campo.getAttribute('aria-describedby')).toBe('campo-error');
  });

  it('sceglie il messaggio dal tipo di errore', async () => {
    const { scrivi, esci, messaggio } = await crea();
    await scrivi('ab');
    await esci();
    expect(messaggio()).toBe('validation.minLength');
  });

  it('toglie il messaggio quando il valore diventa valido', async () => {
    const { campo, scrivi, esci, messaggio } = await crea();
    await esci();
    await scrivi('abc');
    expect(messaggio()).toBeUndefined();
    expect(campo.getAttribute('aria-invalid')).toBe('false');
  });

  it('si disabilita quando il campo è disabilitato', async () => {
    const { fixture, host, campo } = await crea();
    host.spento.set(true);
    await fixture.whenStable();
    expect(campo.disabled).toBe(true);
  });
});
