import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterPage } from './register-page';

describe('RegisterPage', () => {
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(RegisterPage);
    await fixture.whenStable();
    html = fixture.nativeElement;
  });

  it('mostra il titolo e il segnaposto', () => {
    expect(html.querySelector('h1')?.textContent).toContain('register.title');
    expect(html.querySelector('p')?.textContent).toContain('register.comingSoonHint');
  });

  it('ha un link sottolineato che torna al login', () => {
    const link = html.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/login');
    expect(link.classList).toContain('underline');
  });
});
