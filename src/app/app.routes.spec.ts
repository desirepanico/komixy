import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthNavigationService } from '@features/auth/services/auth-navigation/auth-navigation.service';
import { ComicsNavigationService } from '@features/comics/services/comics-navigation/comics-navigation.service';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { NotFoundNavigationService } from '@features/not-found/services/not-found-navigation/not-found-navigation.service';
import { RankingNavigationService } from '@features/ranking/services/ranking-navigation/ranking-navigation.service';
import { LibraryNavigationService } from '@features/library/services/library-navigation/library-navigation.service';
import { ProfileNavigationService } from '@features/profile/services/profile-navigation/profile-navigation.service';
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

  it('library mostra la pagina della libreria', async () => {
    const { html } = await apri('/library');
    expect(html.querySelector('app-library-page')).not.toBeNull();
  });

  it('profile mostra la pagina del profilo', async () => {
    const { html } = await apri('/profile');
    expect(html.querySelector('app-profile-page')).not.toBeNull();
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
        'ranking → rankingLink',
        () => TestBed.inject(RankingNavigationService).rankingLink,
        'app-ranking-page',
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
        'releases → releasesLink',
        () => TestBed.inject(ReleasesNavigationService).releasesLink,
        'app-releases-page',
      ],
      [
        'library → libraryLink',
        () => TestBed.inject(LibraryNavigationService).libraryLink,
        'app-library-page',
      ],
      [
        'profile → profileLink',
        () => TestBed.inject(ProfileNavigationService).profileLink,
        'app-profile-page',
      ],
      ['auth → loginLink', () => TestBed.inject(AuthNavigationService).loginLink, 'app-login-page'],
      [
        'not-found → notFoundLink',
        () => TestBed.inject(NotFoundNavigationService).notFoundLink,
        'app-not-found-page',
      ],
    ];

    it.each(casi)('%s apre la pagina della sua feature', async (_nome, link, pagina) => {
      const router = TestBed.inject(Router);
      const url = router.serializeUrl(router.createUrlTree([...link()]));
      const { html } = await apri(url);
      expect(html.matches(pagina) || html.querySelector(pagina) !== null).toBe(true);
    });
  });
});
