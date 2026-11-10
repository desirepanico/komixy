import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { provideRouter } from '@angular/router';
import { UserRole } from '@shared/models/user-role.model';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoggedUser } from '../../models/auth.model';
import { ApiError, AuthService } from '../../services/auth/auth.service';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForm],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(TranslocoService).setTranslation(
      {
        common: {
          validation: {
            required: 'required',
            email: 'email',
            minLength: 'minLength',
            generic: 'generic',
            invalidCredentials: 'invalidCredentials',
          },
        },
      },
      'it',
    );
  });

  let fixture: ComponentFixture<LoginForm>;
  let html: HTMLElement;
  let successi = 0;

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
    successi = 0;
    fixture = TestBed.createComponent(LoginForm);
    fixture.componentInstance.loginSuccess.subscribe(() => successi++);
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
    expect(errori()).toEqual(['required']);
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
    expect(errori()).toEqual(['required', 'required']);
    expect(campo('login-email').getAttribute('aria-invalid')).toBe('true');
    expect(successi).toBe(0);
  });

  it('segnala email non valida e password troppo corta', async () => {
    scrivi('login-email', 'non-una-email');
    scrivi('login-password', '123');
    await invia();
    expect(errori()).toEqual(['email', 'minLength']);
    expect(successi).toBe(0);
  });

  describe('chiamata di accesso', () => {
    const utente: LoggedUser = { id: 'a@b.it', email: 'a@b.it', userRole: UserRole.User };
    let risposta: Subject<LoggedUser>;

    const bottone = () => html.querySelector('button[type="submit"]') as HTMLButtonElement;
    // La risposta passa da una Promise: serve un giro del loop prima che il form aggiorni lo stato
    const attendi = async () => {
      await new Promise((resolve) => setTimeout(resolve));
      await fixture.whenStable();
    };
    const compilaEInvia = async () => {
      scrivi('login-email', 'a@b.it');
      scrivi('login-password', '123456');
      await invia();
    };

    beforeEach(() => {
      risposta = new Subject<LoggedUser>();
      vi.spyOn(TestBed.inject(AuthService), 'authenticate').mockReturnValue(risposta);
    });

    it('finché attende disattiva il bottone, poi emette loginSuccess', async () => {
      await compilaEInvia();
      expect(bottone().disabled).toBe(true);
      expect(bottone().textContent).toContain('login.submitting');
      expect(successi).toBe(0);

      risposta.next(utente);
      risposta.complete();
      await attendi();
      expect(successi).toBe(1);
      expect(bottone().disabled).toBe(false);
      expect(errori()).toEqual([]);
    });

    it('con credenziali sbagliate mostra l’errore e non emette nulla', async () => {
      await compilaEInvia();
      risposta.error(new ApiError(401, 'Credenziali non valide'));
      await attendi();
      expect(errori()).toEqual(['invalidCredentials']);
      expect(successi).toBe(0);
      expect(bottone().disabled).toBe(false);
    });

    it('con un errore diverso da 401 mostra l’errore del server', async () => {
      await compilaEInvia();
      risposta.error(new ApiError(500, 'Errore'));
      await attendi();
      expect(errori()).toEqual(['login.serverError']);
    });

    it('dopo un errore del server si può riprovare senza modificare i campi', async () => {
      await compilaEInvia();
      risposta.error(new ApiError(500, 'Errore'));
      await attendi();

      risposta = new Subject<LoggedUser>();
      vi.spyOn(TestBed.inject(AuthService), 'authenticate').mockReturnValue(risposta);
      await invia();
      risposta.next(utente);
      risposta.complete();
      await attendi();
      expect(errori()).toEqual([]);
      expect(successi).toBe(1);
    });

    it('toglie l’errore delle credenziali quando si modifica la password', async () => {
      await compilaEInvia();
      risposta.error(new ApiError(401, 'Credenziali non valide'));
      await attendi();
      expect(errori()).toEqual(['invalidCredentials']);

      scrivi('login-password', '1234567');
      await fixture.whenStable();
      expect(errori()).toEqual([]);
    });
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
    expect(errori()).toEqual(['required']);
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
      Array.from(html.querySelectorAll('button, a')).find((b) =>
        b.textContent?.includes(testo),
      ) as HTMLElement;

    it('ha link sottolineati verso recupero password e registrazione', () => {
      const forgot = pulsante('login.forgotPassword');
      const register = pulsante('login.register');
      expect(forgot.getAttribute('href')).toBe('/login/forgot-password');
      expect(register.getAttribute('href')).toBe('/login/register');
      expect([forgot, register].every((l) => l.classList.contains('hover:underline'))).toBe(true);
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
      expect(
        html.querySelector(`#${bottone.getAttribute('aria-describedby')}`)?.textContent,
      ).toContain('login.guestHint');
    });
  });
});
