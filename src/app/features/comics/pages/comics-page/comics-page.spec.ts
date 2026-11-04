import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { describe, expect, it } from 'vitest';
import { ComicsPage } from './comics-page';

describe('ComicsPage', () => {
  it('mostra il segnaposto tradotto', () => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
    });
    const fixture = TestBed.createComponent(ComicsPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('comics.comingSoon');
  });
});
