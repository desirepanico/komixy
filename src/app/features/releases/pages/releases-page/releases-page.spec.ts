import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ReleasesPage } from './releases-page';

describe('ReleasesPage', () => {
  let fixture: ComponentFixture<ReleasesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ReleasesPage] }).compileComponents();
    fixture = TestBed.createComponent(ReleasesPage);
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra titolo e segnaposto tradotti', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('common.releases');
    expect(text).toContain('releases.comingSoon');
    expect(text).toContain('releases.comingSoonHint');
  });

  it("nasconde l'icona decorativa ai lettori di schermo", () => {
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"] ng-icon')).not.toBeNull();
  });
});
