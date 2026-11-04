import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ReleasesPage } from './releases-page';

describe('ReleasesPage', () => {
  it('viene creata e mostra il segnaposto', () => {
    const fixture = TestBed.createComponent(ReleasesPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p')).not.toBeNull();
  });
});
