import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ComicsPage } from './comics-page';

describe('ComicsPage', () => {
  it('mostra il segnaposto tradotto', async () => {
    const fixture = TestBed.createComponent(ComicsPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('comics.comingSoon');
  });
});
