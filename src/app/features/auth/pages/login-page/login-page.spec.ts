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

  const open = async (url: string) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url, LoginPage);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    return harness.routeNativeElement as HTMLElement;
  };

  const signIn = async (html: HTMLElement) => {
    const write = (id: string, value: string) => {
      const field = html.querySelector(`#${id}`) as HTMLInputElement;
      field.value = value;
      field.dispatchEvent(new Event('input'));
    };
    write('login-email', DEMO_CREDENTIALS.email);
    write('login-password', DEMO_CREDENTIALS.password);
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
    expect(await open('/login')).toBeTruthy();
  });

  it('mostra il titolo e il form', async () => {
    const html = await open('/login');
    expect(html.querySelector('h1')?.textContent).toContain('login.submit');
    expect(html.querySelector('app-login-form')).not.toBeNull();
  });

  it('mostra il pannello di marca accanto al form', async () => {
    const html = await open('/login');
    expect(html.querySelector('app-login-volumes')).not.toBeNull();
    expect(html.querySelector('app-login-form')).not.toBeNull();
  });

  it('dopo il login registra l’utente e torna alla pagina richiesta', async () => {
    const html = await open('/login?returnUrl=%2Freleases');
    await signIn(html);

    expect(auth.loggedUser()).toEqual({
      id: DEMO_CREDENTIALS.email,
      email: DEMO_CREDENTIALS.email,
      userRole: UserRole.User,
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/releases');
  });

  it('senza returnUrl va a Scopri', async () => {
    await signIn(await open('/login'));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });

  it('con un returnUrl esterno va a Scopri', async () => {
    await signIn(await open('/login?returnUrl=https%3A%2F%2Fsito.it'));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });

  it('l’accesso come ospite entra senza utente e va a Scopri', async () => {
    const html = await open('/login');
    const button = Array.from(html.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('login.guest'),
    );
    button?.click();
    expect(auth.loggedUser()).toBeNull();
    expect(auth.isAuthenticated()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });
});
