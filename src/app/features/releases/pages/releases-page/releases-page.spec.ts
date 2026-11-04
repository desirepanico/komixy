import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ReleasesPage } from './releases-page';

describe('ReleasesPage', () => {
  it('mostra il segnaposto tradotto', async () => {
    const fixture = TestBed.createComponent(ReleasesPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('releases.comingSoon');
  });
});
