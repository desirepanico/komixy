import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { describe, expect, it } from 'vitest';
import { ReleasesPage } from './releases-page';

describe('ReleasesPage', () => {
  it('mostra il segnaposto tradotto', () => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
    });
    const fixture = TestBed.createComponent(ReleasesPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('releases.comingSoon');
  });
});
