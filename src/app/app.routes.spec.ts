import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routes } from './app.routes';

describe('routes', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter(routes)],
    });
  });

  const apri = async (url: string) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    return {
      html: harness.routeNativeElement as HTMLElement,
      url: TestBed.inject(Router).url,
    };
  };

  it('la radice porta a Scopri, dentro il layout', async () => {
    const { html, url } = await apri('/');
    expect(url).toBe('/discover');
    expect(html.querySelector('app-layout app-discover-page')).not.toBeNull();
  });

  it('discover/ranking mostra la classifica dentro il layout', async () => {
    const { html } = await apri('/discover/ranking');
    expect(html.querySelector('app-layout app-ranking-page')).not.toBeNull();
  });

  it('releases mostra la pagina delle uscite', async () => {
    const { html } = await apri('/releases');
    expect(html.querySelector('app-releases-page')).not.toBeNull();
  });

  it('comic/:id mostra la pagina dei fumetti', async () => {
    const { html } = await apri('/comic/42');
    expect(html.querySelector('app-comics-page')).not.toBeNull();
  });

  it('login è fuori dal layout', async () => {
    const { html } = await apri('/login');
    expect(html.localName).toBe('app-login-page');
    expect(html.querySelector('app-layout')).toBeNull();
  });

  it('un indirizzo sconosciuto mostra la pagina 404', async () => {
    const { html } = await apri('/non-esiste');
    expect(html.localName).toBe('app-not-found-page');
  });
});
