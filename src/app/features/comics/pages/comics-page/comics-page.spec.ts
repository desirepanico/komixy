import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicsPage } from './comics-page';

describe('ComicsPage', () => {
  let fixture: ComponentFixture<ComicsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ComicsPage] }).compileComponents();
    fixture = TestBed.createComponent(ComicsPage);
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il segnaposto tradotto', () => {
    expect(fixture.nativeElement.textContent).toContain('comics.comingSoon');
  });
});
