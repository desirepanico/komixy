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

  it('mostra il segnaposto tradotto', () => {
    expect(fixture.nativeElement.textContent).toContain('releases.comingSoon');
  });
});
