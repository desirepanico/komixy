import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '@shared/models/user-role.model';
import { DEMO_CREDENTIALS, FAKE_API_DELAY_MS } from '@shared/constants/form.const';
import { AuthService } from '../../services/auth/auth.service';
import { LoginPage } from './login-page';

describe('LoginPage', () => {
  let router: Router;
  let auth: AuthService;

  const apri = async (url: string) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url, LoginPage);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    return harness.routeNativeElement as HTMLElement;
  };

  const accedi = async (html: HTMLElement) => {
    const scrivi = (id: string, valore: string) => {
      const campo = html.querySelector(`#${id}`) as HTMLInputElement;
      campo.value = valore;
      campo.dispatchEvent(new Event('input'));
    };
    scrivi('login-email', DEMO_CREDENTIALS.email);
    scrivi('login-password', DEMO_CREDENTIALS.password);
    html.querySelector('form')?.dispatchEvent(new Event('submit'));
    await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
  };

  afterEach(() => vi.useRealTimers());

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([{ path: 'login', component: LoginPage }])],
    }).compileComponents();
    router = TestBed.inject(Router);
    auth = TestBed.inject(AuthService);
  });

  it('viene creata', async () => {
    expect(await apri('/login')).toBeTruthy();
  });

  it('mostra il titolo e il form', async () => {
    const html = await apri('/login');
    expect(html.querySelector('h1')?.textContent).toContain('login.submit');
    expect(html.querySelector('app-login-form')).not.toBeNull();
  });

  it('mostra il pannello di marca accanto al form', async () => {
    const html = await apri('/login');
    expect(html.querySelector('app-login-volumes')).not.toBeNull();
    expect(html.querySelector('app-login-form')).not.toBeNull();
  });

  it('dopo il login registra l’utente e torna alla pagina richiesta', async () => {
    const html = await apri('/login?returnUrl=%2Freleases');
    await accedi(html);

    expect(auth.loggedUser()).toEqual({
      id: DEMO_CREDENTIALS.email,
      email: DEMO_CREDENTIALS.email,
      userRole: UserRole.User,
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/releases');
  });

  it('senza returnUrl va a Scopri', async () => {
    await accedi(await apri('/login'));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });

  it('con un returnUrl esterno va a Scopri', async () => {
    await accedi(await apri('/login?returnUrl=https%3A%2F%2Fsito.it'));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });

  it('l’accesso come ospite registra un utente con ruolo Guest', async () => {
    const html = await apri('/login');
    const bottone = Array.from(html.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('login.guest'),
    );
    bottone?.click();
    expect(auth.loggedUser()?.userRole).toBe(UserRole.Guest);
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });
});
