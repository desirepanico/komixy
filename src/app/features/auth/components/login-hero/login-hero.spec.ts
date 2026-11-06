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

  const bottoni = () => Array.from(html.querySelectorAll('button'));
  const premi = async (indice: number) => {
    bottoni()[indice].click();
    await fixture.whenStable();
  };
  const dietro = (indice: number) =>
    bottoni()[indice].querySelector('[aria-hidden]:last-child') as HTMLElement;

  it('mostra quattro copertine, ognuna un bottone con il suo testo alternativo tradotto', () => {
    expect(bottoni()).toHaveLength(4);
    bottoni().forEach((bottone) => {
      expect(bottone.querySelector('img')?.getAttribute('alt')).toBe('mangaCard.coverAlt');
      expect(bottone.getAttribute('aria-pressed')).toBe('false');
    });
  });

  it('dietro ogni copertina ci sono titolo, autore e tipo', () => {
    const testo = dietro(0).textContent ?? '';
    expect(testo).toContain('One Piece');
    expect(testo).toContain('Eiichiro Oda');
    expect(testo).toContain('loginHero.kind.manga');
    expect(dietro(1).textContent).toContain('loginHero.kind.comic');
  });

  it('all’inizio il retro è nascosto agli screen reader', () => {
    expect(dietro(0).getAttribute('aria-hidden')).toBe('true');
  });

  it('un clic gira la copertina e mostra il retro agli screen reader', async () => {
    await premi(0);
    expect(bottoni()[0].getAttribute('aria-pressed')).toBe('true');
    expect(bottoni()[0].querySelector('.rotate-y-180')).not.toBeNull();
    expect(dietro(0).getAttribute('aria-hidden')).toBe('false');
  });

  it('un secondo clic la rigira', async () => {
    await premi(0);
    await premi(0);
    expect(bottoni()[0].getAttribute('aria-pressed')).toBe('false');
    expect(dietro(0).getAttribute('aria-hidden')).toBe('true');
  });

  it('girare una copertina non cambia le altre', async () => {
    await premi(0);
    expect(bottoni()[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('invita a toccare una copertina', () => {
    expect(html.textContent).toContain('loginHero.coversHint');
  });

  it('i bagliori sono nascosti agli screen reader', () => {
    expect(html.querySelector('.animate-orb')?.parentElement?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('ogni animazione si ferma con prefers-reduced-motion', () => {
    const animati = html.querySelectorAll('.animate-float, .animate-orb, .animate-fade-up');
    expect(animati.length).toBeGreaterThan(4);
    animati.forEach((el) => expect(el.classList).toContain('motion-reduce:animate-none'));
  });
});
