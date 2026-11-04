import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LibraryPage } from './library-page';

describe('LibraryPage', () => {
  let fixture: ComponentFixture<LibraryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LibraryPage] }).compileComponents();
    fixture = TestBed.createComponent(LibraryPage);
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il segnaposto tradotto', () => {
    expect(fixture.nativeElement.textContent).toContain('library.comingSoon');
  });
});
