import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthNavigationService } from '@features/auth/services/auth-navigation/auth-navigation.service';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { NotFoundNavigationService } from '@features/not-found/services/not-found-navigation/not-found-navigation.service';
import { RankingNavigationService } from '@features/ranking/services/ranking-navigation/ranking-navigation.service';
import { ReleasesNavigationService } from '@features/releases/services/releases-navigation/releases-navigation.service';
import { routes } from './app.routes';

describe('routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
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
  describe('i link dei servizi di navigazione', () => {
    const casi: [string, () => readonly string[], string][] = [
      [
        'discover → discoverLink',
        () => TestBed.inject(DiscoverNavigationService).discoverLink,
        'app-discover-page',
      ],
      [
        'discover → rankingLink',
        () => TestBed.inject(DiscoverNavigationService).rankingLink,
        'app-ranking-page',
      ],
      [
        'discover → comicLink',
        () => TestBed.inject(DiscoverNavigationService).comicLink('1'),
        'app-comics-page',
      ],
      [
        'ranking → rankingLink',
        () => TestBed.inject(RankingNavigationService).rankingLink,
        'app-ranking-page',
      ],
      [
        'ranking → discoverLink',
        () => TestBed.inject(RankingNavigationService).discoverLink,
        'app-discover-page',
      ],
      [
        'ranking → comicLink',
        () => TestBed.inject(RankingNavigationService).comicLink('1'),
        'app-comics-page',
      ],
      [
        'comics → comicsLink',
        () => TestBed.inject(ComicsNavigationService).comicsLink,
        'app-comics-page',
      ],
      [
        'comics → detailLink',
        () => TestBed.inject(ComicsNavigationService).detailLink('1'),
        'app-comics-page',
      ],
      [
        'comics → discoverLink',
        () => TestBed.inject(ComicsNavigationService).discoverLink,
        'app-discover-page',
      ],
      [
        'releases → releasesLink',
        () => TestBed.inject(ReleasesNavigationService).releasesLink,
        'app-releases-page',
      ],
      [
        'releases → discoverLink',
        () => TestBed.inject(ReleasesNavigationService).discoverLink,
        'app-discover-page',
      ],
      ['auth → loginLink', () => TestBed.inject(AuthNavigationService).loginLink, 'app-login-page'],
      [
        'not-found → homeLink',
        () => TestBed.inject(NotFoundNavigationService).homeLink,
        'app-discover-page',
      ],
    ];

    it.each(casi)('%s porta alla pagina giusta', async (_nome, link, pagina) => {
      const router = TestBed.inject(Router);
      const url = router.serializeUrl(router.createUrlTree([...link()]));
      const { html } = await apri(url);
      expect(html.matches(pagina) || html.querySelector(pagina) !== null).toBe(true);
    });
  });
});
