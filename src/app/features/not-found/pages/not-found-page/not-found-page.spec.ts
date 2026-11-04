import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { describe, expect, it } from 'vitest';
import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  it('mostra il titolo 404 e un link per tornare a Scopri', () => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(NotFoundPage);
    fixture.detectChanges();
    const html: HTMLElement = fixture.nativeElement;

    expect(html.querySelector('h1')?.textContent).toContain('notFound.title');
    const link = html.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/discover');
    expect(link.textContent).toContain('notFound.backHome');
  });
});
