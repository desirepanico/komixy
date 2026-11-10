import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, minLength, required } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputPassword } from './input-password';

@Component({
  imports: [InputPassword],
  template: `
    <app-input-password
      label="login.password"
      inputId="password"
      placeholder="login.passwordPlaceholder"
      [field]="campoForm"
    />
  `,
})
class Host {
  readonly testo = signal('');
  readonly campoForm = form(this.testo, (path) => {
    required(path);
    minLength(path, 6);
  });
}

describe('InputPassword', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    TestBed.inject(TranslocoService).setTranslation(
      {
        common: {
          validation: {
            required: 'required',
            email: 'email',
            minLength: 'minLength',
            generic: 'generic',
          },
        },
      },
      'it',
    );
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
    return {
      fixture,
      host: fixture.componentInstance,
      html,
      campo,
      occhio: html.querySelector('button') as HTMLButtonElement,
      scrivi,
      esci,
      messaggio: () => html.querySelector('[role="alert"]')?.textContent?.trim(),
    };
  };

  it('viene creato', async () => {
    expect((await crea()).fixture).toBeTruthy();
  });

  it('mostra il nome del campo', async () => {
    expect((await crea()).html.querySelector('label')?.textContent?.trim()).toBe('login.password');
  });

  it('mostra il segnaposto tradotto', async () => {
    const { campo } = await crea();
    expect(campo.getAttribute('placeholder')).toBe('login.passwordPlaceholder');
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

  it('aggiorna il modello mentre si scrive', async () => {
    const { host, scrivi } = await crea();
    await scrivi('123456');
    expect(host.testo()).toBe('123456');
  });

  it('non mostra errori finché il campo non è stato toccato', async () => {
    const { campo, messaggio } = await crea();
    expect(messaggio()).toBeUndefined();
    expect(campo.getAttribute('aria-invalid')).toBe('false');
  });

  it('dopo l’uscita dal campo mostra il messaggio e lo collega al campo', async () => {
    const { html, campo, esci, messaggio } = await crea();
    await esci();
    expect(messaggio()).toBe('required');
    expect(html.querySelector('[role="alert"]')?.id).toBe('password-error');
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(campo.getAttribute('aria-describedby')).toBe('password-error');
  });

  it('sceglie il messaggio dal tipo di errore', async () => {
    const { scrivi, esci, messaggio } = await crea();
    await scrivi('123');
    await esci();
    expect(messaggio()).toBe('minLength');
  });
});
