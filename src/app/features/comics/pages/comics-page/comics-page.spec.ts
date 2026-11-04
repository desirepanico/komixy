import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ComicsPage } from './comics-page';

describe('ComicsPage', () => {
  it('viene creata e mostra il segnaposto', () => {
    const fixture = TestBed.createComponent(ComicsPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p')).not.toBeNull();
  });
});
