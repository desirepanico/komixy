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

  it('mostra titolo e segnaposto tradotti', () => {
    const testo = fixture.nativeElement.textContent;
    expect(testo).toContain('library.title');
    expect(testo).toContain('library.comingSoon');
    expect(testo).toContain('library.comingSoonHint');
  });

  it('nasconde l\'icona decorativa ai lettori di schermo', () => {
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"] ng-icon')).not.toBeNull();
  });
});
