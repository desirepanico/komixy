import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoginForm] }).compileComponents();
  });

  let fixture: ComponentFixture<LoginForm>;
  let html: HTMLElement;
  const emessi: unknown[] = [];

  const campo = (id: string) => html.querySelector(`#${id}`) as HTMLInputElement;
  const scrivi = (id: string, valore: string) => {
    campo(id).value = valore;
    campo(id).dispatchEvent(new Event('input'));
  };
  const invia = async () => {
    html.querySelector('form')?.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };
  const errori = () =>
    Array.from(html.querySelectorAll('[role="alert"]')).map((e) => e.textContent?.trim());

  beforeEach(async () => {
    emessi.length = 0;
    fixture = TestBed.createComponent(LoginForm);
    fixture.componentInstance.loginSubmit.subscribe((c) => emessi.push(c));
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il segnaposto di email e password', () => {
    expect(campo('login-email').getAttribute('placeholder')).toBe('login.emailPlaceholder');
    expect(campo('login-password').getAttribute('placeholder')).toBe('login.passwordPlaceholder');
  });

  it('non mostra errori prima del primo invio', () => {
    expect(errori()).toEqual([]);
  });

  it('mostra l’errore di un campo quando si esce senza compilarlo', async () => {
    campo('login-email').dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(errori()).toEqual(['validation.required']);
  });

  it('dopo un invio fallito porta il focus sul primo campo non valido', async () => {
    await invia();
    expect(document.activeElement).toBe(campo('login-email'));

    scrivi('login-email', 'a@b.it');
    await invia();
    expect(document.activeElement).toBe(campo('login-password'));
  });

  it('con il form vuoto mostra gli errori e non emette nulla', async () => {
    await invia();
    expect(errori()).toEqual(['validation.required', 'validation.required']);
    expect(campo('login-email').getAttribute('aria-invalid')).toBe('true');
    expect(emessi).toEqual([]);
  });

  it('segnala email non valida e password troppo corta', async () => {
    scrivi('login-email', 'non-una-email');
    scrivi('login-password', '123');
    await invia();
    expect(errori()).toEqual(['validation.email', 'validation.minLength']);
    expect(emessi).toEqual([]);
  });

  it('con credenziali valide emette email e password', async () => {
    scrivi('login-email', 'a@b.it');
    scrivi('login-password', '123456');
    await invia();
    expect(errori()).toEqual([]);
    expect(emessi).toEqual([{ email: 'a@b.it', password: '123456' }]);
  });

  it('mostra e nasconde la password', async () => {
    const occhio = html.querySelector('button[aria-pressed]') as HTMLButtonElement;
    expect(campo('login-password').type).toBe('password');
    expect(occhio.getAttribute('aria-pressed')).toBe('false');

    occhio.click();
    await fixture.whenStable();
    expect(campo('login-password').type).toBe('text');
    expect(occhio.getAttribute('aria-pressed')).toBe('true');

    occhio.click();
    await fixture.whenStable();
    expect(campo('login-password').type).toBe('password');
    expect(occhio.getAttribute('aria-pressed')).toBe('false');
  });

  it('l’occhio mantiene la stessa etichetta quando cambia stato', async () => {
    const occhio = html.querySelector('button[aria-pressed]') as HTMLButtonElement;
    occhio.click();
    await fixture.whenStable();
    expect(occhio.getAttribute('aria-label')).toBe('inputPassword.show');
  });

  it('collega ogni errore al suo campo con aria-describedby', async () => {
    expect(campo('login-email').getAttribute('aria-describedby')).toBeNull();

    await invia();
    expect(campo('login-email').getAttribute('aria-describedby')).toBe('login-email-error');
    expect(campo('login-password').getAttribute('aria-describedby')).toBe('login-password-error');
    expect(html.querySelector('#login-email-error')).not.toBeNull();
  });

  it('toglie l’errore man mano che i campi diventano validi', async () => {
    await invia();
    scrivi('login-email', 'a@b.it');
    await fixture.whenStable();
    expect(errori()).toEqual(['validation.required']);
    expect(campo('login-email').getAttribute('aria-invalid')).toBe('false');
    expect(campo('login-email').getAttribute('aria-describedby')).toBeNull();

    scrivi('login-password', '123456');
    await fixture.whenStable();
    expect(errori()).toEqual([]);
    expect(campo('login-password').getAttribute('aria-invalid')).toBe('false');
    expect(campo('login-password').getAttribute('aria-describedby')).toBeNull();
  });

  describe('altre azioni', () => {
    const pulsante = (testo: string) =>
      Array.from(html.querySelectorAll('button')).find((b) =>
        b.textContent?.includes(testo),
      ) as HTMLButtonElement;

    it('emette il recupero password e la registrazione', () => {
      let password = 0;
      let registra = 0;
      fixture.componentInstance.forgotPassword.subscribe(() => password++);
      fixture.componentInstance.registerClick.subscribe(() => registra++);
      pulsante('login.forgotPassword').click();
      pulsante('login.register').click();
      expect([password, registra]).toEqual([1, 1]);
    });

    it('emette il provider scelto per Google e Apple', () => {
      const provider: unknown[] = [];
      fixture.componentInstance.socialLogin.subscribe((p) => provider.push(p));
      (html.querySelector('[aria-label="login.google"]') as HTMLElement).click();
      (html.querySelector('[aria-label="login.apple"]') as HTMLElement).click();
      expect(provider).toEqual(['google', 'apple']);
    });

    it('emette l’accesso come ospite, visibile solo da desktop', () => {
      let ospite = 0;
      fixture.componentInstance.guestAccess.subscribe(() => ospite++);
      const bottone = pulsante('login.guest');
      bottone.click();
      expect(ospite).toBe(1);
      expect(bottone.parentElement?.classList).toContain('hidden');
      expect(bottone.parentElement?.classList).toContain('lg:block');
    });
  });
});
