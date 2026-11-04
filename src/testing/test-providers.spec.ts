import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { describe, expect, it } from 'vitest';
import providers, { provideTranslocoTesting } from './test-providers';

@Component({ imports: [TranslocoPipe], template: `{{ 'menu.main' | transloco }}` })
class Host {}

describe('provideTranslocoTesting', () => {
  it('è caricato di default in ogni TestBed e mostra le chiavi', async () => {
    expect(providers).toBeInstanceOf(Array);
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toBe('menu.main');
  });

  it('con traduzioni proprie mostra i testi tradotti', async () => {
    TestBed.configureTestingModule({
      providers: [provideTranslocoTesting({ it: { menu: { main: 'Principale' } } })],
    });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toBe('Principale');
    expect(TestBed.inject(TranslocoService).getActiveLang()).toBe('it');
  });
});
