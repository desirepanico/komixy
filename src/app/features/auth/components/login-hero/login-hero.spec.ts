import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoginHero } from './login-hero';

describe('LoginHero', () => {
  let fixture: ComponentFixture<LoginHero>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoginHero] }).compileComponents();
    fixture = TestBed.createComponent(LoginHero);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra marchio, titolo e sottotitolo come chiavi di traduzione', () => {
    const testo = html.textContent ?? '';
    expect(testo).toContain('loginHero.brand');
    expect(testo).toContain('loginHero.title');
    expect(testo).toContain('loginHero.subtitle');
  });

  it('mostra quattro volumi, nascosti agli screen reader', () => {
    const volumi = html.querySelectorAll('.animate-float');
    expect(volumi.length).toBe(4);
    expect(volumi[0].parentElement?.getAttribute('aria-hidden')).toBe('true');
  });

  it('non ha elementi focalizzabili: è solo decorazione e testo', () => {
    expect(html.querySelector('a, button, input, [tabindex]')).toBeNull();
  });

  it('ogni animazione si ferma con prefers-reduced-motion', () => {
    const animati = html.querySelectorAll('.animate-float, .animate-orb, .animate-fade-up');
    expect(animati.length).toBeGreaterThan(4);
    animati.forEach((el) => expect(el.classList).toContain('motion-reduce:animate-none'));
  });
});
