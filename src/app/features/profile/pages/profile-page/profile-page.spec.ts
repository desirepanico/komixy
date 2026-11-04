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

  it('mostra titolo e segnaposto tradotti', () => {
    const testo = fixture.nativeElement.textContent;
    expect(testo).toContain('profile.title');
    expect(testo).toContain('profile.comingSoon');
    expect(testo).toContain('profile.comingSoonHint');
  });

  it('nasconde l\'icona decorativa ai lettori di schermo', () => {
    expect(fixture.nativeElement.querySelector('[aria-hidden="true"] ng-icon')).not.toBeNull();
  });
});
