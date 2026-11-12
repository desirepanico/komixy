import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { provideRouter } from '@angular/router';
import { ToastService } from '@shared/services/toast/toast.service';
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
        validation: {
          required: 'required',
          email: 'email',
          minLength: 'minLength',
          generic: 'generic',
        },
      },
      'it',
    );
  });

  let fixture: ComponentFixture<LoginForm>;
  let html: HTMLElement;
  let successes = 0;

  const field = (id: string) => html.querySelector(`#${id}`) as HTMLInputElement;
  const write = (id: string, valore: string) => {
    field(id).value = valore;
    field(id).dispatchEvent(new Event('input'));
  };
  const submit = async () => {
    html.querySelector('form')?.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };
  const errors = () =>
    Array.from(html.querySelectorAll('[role="alert"]')).map((e) => e.textContent?.trim());

  beforeEach(async () => {
    successes = 0;
    fixture = TestBed.createComponent(LoginForm);
    fixture.componentInstance.loginSuccess.subscribe(() => successes++);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il segnaposto di email e password', () => {
    expect(field('login-email').getAttribute('placeholder')).toBe('login.emailPlaceholder');
    expect(field('login-password').getAttribute('placeholder')).toBe('login.passwordPlaceholder');
  });

  it('non mostra errori prima del primo invio', () => {
    expect(errors()).toEqual([]);
  });

  it('mostra l’errore di un campo quando si esce senza compilarlo', async () => {
    field('login-email').dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(errors()).toEqual(['required']);
  });

  it('dopo un invio fallito porta il focus sul primo campo non valido', async () => {
    await submit();
    expect(document.activeElement).toBe(field('login-email'));

    write('login-email', 'a@b.it');
    await submit();
    expect(document.activeElement).toBe(field('login-password'));
  });

  it('con il form vuoto mostra gli errori e non emette nulla', async () => {
    await submit();
    expect(errors()).toEqual(['required', 'required']);
    expect(field('login-email').getAttribute('aria-invalid')).toBe('true');
    expect(successes).toBe(0);
  });

  it('segnala email non valida e password troppo corta', async () => {
    write('login-email', 'non-una-email');
    write('login-password', '123');
    await submit();
    expect(errors()).toEqual(['email', 'minLength']);
    expect(successes).toBe(0);
  });

  describe('chiamata di accesso', () => {
    const user: LoggedUser = { id: 'a@b.it', email: 'a@b.it', userRole: UserRole.User };
    let response: Subject<LoggedUser>;

    const button = () => html.querySelector('button[type="submit"]') as HTMLButtonElement;
    // La risposta passa da una Promise: serve un giro del loop prima che il form aggiorni lo stato
    const wait = async () => {
      await new Promise((resolve) => setTimeout(resolve));
      await fixture.whenStable();
    };
    const fillAndSubmit = async () => {
      write('login-email', 'a@b.it');
      write('login-password', '12345678');
      await submit();
    };

    beforeEach(() => {
      response = new Subject<LoggedUser>();
      vi.spyOn(TestBed.inject(AuthService), 'authenticate').mockReturnValue(response);
    });

    it('finché attende disattiva il bottone, poi emette loginSuccess', async () => {
      await fillAndSubmit();
      expect(button().disabled).toBe(true);
      expect(button().textContent).toContain('login.submitting');
      expect(successes).toBe(0);

      response.next(user);
      response.complete();
      await wait();
      expect(successes).toBe(1);
      expect(button().disabled).toBe(false);
      expect(errors()).toEqual([]);
    });

    it('con credenziali sbagliate mostra un toast e non emette nulla', async () => {
      const error = vi.spyOn(TestBed.inject(ToastService), 'error');
      await fillAndSubmit();
      response.error(new ApiError(401, 'Credenziali non valide'));
      await wait();
      expect(error).toHaveBeenCalledWith(
        'login.invalidCredentials.summaryKo',
        'login.invalidCredentials.detailKo',
      );
      expect(errors()).toEqual([]);
      expect(successes).toBe(0);
      expect(button().disabled).toBe(false);
    });

    it('con un errore diverso da 401 mostra il toast dell’errore del server', async () => {
      const error = vi.spyOn(TestBed.inject(ToastService), 'error');
      await fillAndSubmit();
      response.error(new ApiError(500, 'Errore'));
      await wait();
      expect(error).toHaveBeenCalledWith(
        'login.serverError.summaryKo',
        'login.serverError.detailKo',
      );
    });

    it('dopo un errore si può riprovare senza modificare i campi', async () => {
      await fillAndSubmit();
      response.error(new ApiError(500, 'Errore'));
      await wait();

      response = new Subject<LoggedUser>();
      vi.spyOn(TestBed.inject(AuthService), 'authenticate').mockReturnValue(response);
      await submit();
      response.next(user);
      response.complete();
      await wait();
      expect(successes).toBe(1);
    });
  });

  it('mostra e nasconde la password', async () => {
    const eye = html.querySelector('button[aria-pressed]') as HTMLButtonElement;
    expect(field('login-password').type).toBe('password');
    expect(eye.getAttribute('aria-pressed')).toBe('false');

    eye.click();
    await fixture.whenStable();
    expect(field('login-password').type).toBe('text');
    expect(eye.getAttribute('aria-pressed')).toBe('true');

    eye.click();
    await fixture.whenStable();
    expect(field('login-password').type).toBe('password');
    expect(eye.getAttribute('aria-pressed')).toBe('false');
  });

  it('l’occhio mantiene la stessa etichetta quando cambia stato', async () => {
    const eye = html.querySelector('button[aria-pressed]') as HTMLButtonElement;
    eye.click();
    await fixture.whenStable();
    expect(eye.getAttribute('aria-label')).toBe('inputPassword.show');
  });

  it('collega ogni errore al suo campo con aria-describedby', async () => {
    expect(field('login-email').getAttribute('aria-describedby')).toBeNull();

    await submit();
    expect(field('login-email').getAttribute('aria-describedby')).toBe('login-email-error');
    expect(field('login-password').getAttribute('aria-describedby')).toBe('login-password-error');
    expect(html.querySelector('#login-email-error')).not.toBeNull();
  });

  it('toglie l’errore man mano che i campi diventano validi', async () => {
    await submit();
    write('login-email', 'a@b.it');
    await fixture.whenStable();
    expect(errors()).toEqual(['required']);
    expect(field('login-email').getAttribute('aria-invalid')).toBe('false');
    expect(field('login-email').getAttribute('aria-describedby')).toBeNull();

    write('login-password', '12345678');
    await fixture.whenStable();
    expect(errors()).toEqual([]);
    expect(field('login-password').getAttribute('aria-invalid')).toBe('false');
    expect(field('login-password').getAttribute('aria-describedby')).toBeNull();
  });

  describe('altre azioni', () => {
    const button = (text: string) =>
      Array.from(html.querySelectorAll('button, a')).find((b) =>
        b.textContent?.includes(text),
      ) as HTMLElement;

    it('ha link sottolineati verso recupero password e registrazione', () => {
      const forgot = button('login.forgotPassword');
      const register = button('login.register');
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
      let guest = 0;
      fixture.componentInstance.guestAccess.subscribe(() => guest++);
      const guestButton = button('login.guest');
      guestButton.click();
      expect(guest).toBe(1);
      expect(guestButton.parentElement?.classList).toContain('hidden');
      expect(guestButton.parentElement?.classList).toContain('md:block');
      expect(
        html.querySelector(`#${guestButton.getAttribute('aria-describedby')}`)?.textContent,
      ).toContain('login.guestHint');
    });
  });
});
