import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '@shared/models/user-role.model';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let router: Router;
  let auth: AuthService;

  const apri = async (url: string) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url, LoginPage);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    return harness.routeNativeElement as HTMLElement;
  };

  const accedi = (html: HTMLElement) => {
    const scrivi = (id: string, valore: string) => {
      const campo = html.querySelector(`#${id}`) as HTMLInputElement;
      campo.value = valore;
      campo.dispatchEvent(new Event('input'));
    };
    scrivi('login-email', 'mario@esempio.it');
    scrivi('login-password', 'segreta1');
    html.querySelector('form')?.dispatchEvent(new Event('submit'));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([{ path: 'login', component: LoginPage }])],
    });
    router = TestBed.inject(Router);
    auth = TestBed.inject(AuthService);
  });

  it('mostra il titolo e il form', async () => {
    const html = await apri('/login');
    expect(html.querySelector('h1')?.textContent).toContain('login.title');
    expect(html.querySelector('app-login-form')).not.toBeNull();
  });

  it('dopo il login registra l’utente e torna alla pagina richiesta', async () => {
    const html = await apri('/login?returnUrl=%2Freleases');
    accedi(html);

    expect(auth.loggedUser()).toEqual({
      id: 'mario@esempio.it',
      email: 'mario@esempio.it',
      userRole: UserRole.User,
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/releases');
  });

  it('senza returnUrl va a Scopri', async () => {
    accedi(await apri('/login'));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/discover');
  });

  it('con un returnUrl esterno va a Scopri', async () => {
    accedi(await apri('/login?returnUrl=https%3A%2F%2Fsito.it'));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/discover');
  });
});
