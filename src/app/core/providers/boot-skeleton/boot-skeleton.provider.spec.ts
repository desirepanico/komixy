import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideBootSkeleton } from './boot-skeleton.provider';

describe('provideBootSkeleton', () => {
  const skeleton = () => document.getElementById('skeleton');

  beforeEach(() => {
    document.body.insertAdjacentHTML('beforeend', '<div id="skeleton"></div>');
  });

  afterEach(() => skeleton()?.remove());

  const avvia = async (rotte: Parameters<typeof provideRouter>[0]) => {
    TestBed.configureTestingModule({ providers: [provideBootSkeleton(), provideRouter(rotte)] });
    await TestBed.inject(ApplicationInitStatus).donePromise;
    return TestBed.inject(Router);
  };

  it('lascia lo skeleton finché la prima navigazione non è finita', async () => {
    await avvia([{ path: 'discover', children: [] }]);
    await TestBed.inject(ApplicationInitStatus).donePromise;
    expect(skeleton()).not.toBeNull();
  });

  it('toglie lo skeleton a prima navigazione finita', async () => {
    const router = await avvia([{ path: 'discover', children: [] }]);
    await router.navigateByUrl('/discover');
    await TestBed.inject(ApplicationInitStatus).donePromise;
    await new Promise((resolve) => setTimeout(resolve));
    expect(skeleton()).toBeNull();
  });

  it('con un reindirizzamento aspetta la pagina finale', async () => {
    const router = await avvia([
      { path: 'old', redirectTo: 'new' },
      { path: 'new', children: [] },
    ]);
    await router.navigateByUrl('/old');
    await new Promise((resolve) => setTimeout(resolve));
    expect(router.url).toBe('/new');
    expect(skeleton()).toBeNull();
  });
});
