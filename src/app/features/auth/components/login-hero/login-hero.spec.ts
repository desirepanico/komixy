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
  const stato = () => html.querySelector('[role="status"]')?.textContent?.trim();

  it('mostra quattro copertine, ognuna un bottone con l’etichetta tradotta e non premuto', () => {
    expect(bottoni()).toHaveLength(4);
    bottoni().forEach((bottone) => {
      expect(bottone.getAttribute('aria-label')).toBe('mangaCard.coverAlt');
      expect(bottone.getAttribute('aria-pressed')).toBe('false');
    });
  });

  it('le immagini sono decorative: il nome lo dà il bottone', () => {
    html.querySelectorAll('img').forEach((img) => expect(img.getAttribute('alt')).toBe(''));
  });

  it('un clic segna la copertina e mostra il segno di spunta', async () => {
    await premi(0);
    expect(bottoni()[0].getAttribute('aria-pressed')).toBe('true');
    expect(bottoni()[0].querySelector('ng-icon')).not.toBeNull();
  });

  it('un secondo clic la toglie', async () => {
    await premi(0);
    await premi(0);
    expect(bottoni()[0].getAttribute('aria-pressed')).toBe('false');
    expect(bottoni()[0].querySelector('ng-icon')).toBeNull();
  });

  it('all’inizio il messaggio invita a toccare le copertine, poi mostra il conteggio', async () => {
    expect(stato()).toBe('loginHero.coversHint');
    await premi(1);
    expect(stato()).toBe('loginHero.coversCount');
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
