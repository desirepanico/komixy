import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { ForgotPasswordPage } from './forgot-password-page';

describe('ForgotPasswordPage', () => {
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPage],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    await fixture.whenStable();
    html = fixture.nativeElement;
  });

  it('mostra il titolo e il segnaposto', () => {
    expect(html.querySelector('h1')?.textContent).toContain('forgotPassword.title');
    expect(html.querySelector('p')?.textContent).toContain('forgotPassword.comingSoonHint');
  });

  it('ha un link sottolineato che torna al login', () => {
    const link = html.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/login');
    expect(link.classList).toContain('underline');
  });
});
