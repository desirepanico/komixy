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

  it('mostra titolo e segnaposto tradotti', () => {
    const testo = fixture.nativeElement.textContent;
    expect(testo).toContain('comics.title');
    expect(testo).toContain('comics.comingSoon');
    expect(testo).toContain('comics.comingSoonHint');
  });

  it('nasconde l\'icona decorativa ai lettori di schermo', () => {
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"] ng-icon')).not.toBeNull();
  });
});
