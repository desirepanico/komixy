import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfilePage } from './profile-page';

describe('ProfilePage', () => {
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProfilePage] }).compileComponents();
    fixture = TestBed.createComponent(ProfilePage);
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il segnaposto tradotto', () => {
    expect(fixture.nativeElement.textContent).toContain('profile.comingSoon');
  });
});
