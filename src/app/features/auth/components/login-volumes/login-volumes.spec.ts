import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoginVolumes } from './login-volumes';

describe('LoginVolumes', () => {
  let fixture: ComponentFixture<LoginVolumes>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoginVolumes] }).compileComponents();
    fixture = TestBed.createComponent(LoginVolumes);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra titolo e sottotitolo come chiavi di traduzione', () => {
    const testo = html.textContent ?? '';
    expect(testo).toContain('loginVolumes.title');
    expect(testo).toContain('loginVolumes.subtitle');
  });

  const bottoni = () => Array.from(html.querySelectorAll<HTMLButtonElement>('button:has(img)'));
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

  it('le copertine si caricano subito perché una è sempre l’elemento più grande della pagina', () => {
    html.querySelectorAll('img').forEach((img) => {
      expect(img.getAttribute('fetchpriority')).toBe('high');
      expect(img.getAttribute('loading')).toBe('eager');
    });
  });

  it('mostra il marchio', () => {
    expect(html.querySelector('app-brand')).not.toBeNull();
  });

  it('dietro ogni copertina ci sono titolo, autore e tipo', () => {
    const testo = dietro(0).textContent ?? '';
    expect(testo).toContain('One Piece');
    expect(testo).toContain('Eiichiro Oda');
    expect(testo).toContain('loginVolumes.kind.manga');
    expect(dietro(1).textContent).toContain('loginVolumes.kind.comic');
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

  it('la copertina girata passa in primo piano e, rigirata, torna al suo posto', async () => {
    const carta = () => bottoni()[0].closest('li') as HTMLElement;
    expect(carta().classList).not.toContain('z-20!');
    await premi(0);
    expect(carta().classList).toContain('z-20!');
    await premi(0);
    expect(carta().classList).not.toContain('z-20!');
  });

  const tocca = async (indice: number) => {
    const evento = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(evento, 'pointerType', { value: 'touch' });
    bottoni()[indice].dispatchEvent(evento);
    await fixture.whenStable();
  };

  it('con il dito il primo tocco porta il volume in avanti senza girarlo', async () => {
    await tocca(0);
    const carta = bottoni()[0].closest('li') as HTMLElement;
    expect(carta.classList).toContain('z-30!');
    expect(bottoni()[0].classList).toContain('scale-110');
    expect(bottoni()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('con il dito il secondo tocco gira il volume e un terzo lo rigira', async () => {
    await tocca(0);
    await tocca(0);
    expect(bottoni()[0].getAttribute('aria-pressed')).toBe('true');
    await tocca(0);
    expect(bottoni()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('con il dito toccare un altro volume sposta la selezione senza girarlo', async () => {
    await tocca(0);
    await tocca(1);
    expect(bottoni()[0].classList).not.toContain('scale-110');
    expect(bottoni()[1].classList).toContain('scale-110');
    expect(bottoni()[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('con mouse e tastiera il clic gira subito e porta in avanti', async () => {
    await premi(0);
    expect(bottoni()[0].getAttribute('aria-pressed')).toBe('true');
    expect((bottoni()[0].closest('li') as HTMLElement).classList).toContain('z-30!');
  });

  it('con l’hover una copertina passa davanti anche a quella scelta con il clic', async () => {
    await premi(0);
    const carta = bottoni()[1].closest('li') as HTMLElement;
    expect(carta.classList).toContain('hover:z-50!');
  });

  it('girare una copertina non cambia le altre', async () => {
    await premi(0);
    expect(bottoni()[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('invita a toccare una copertina', () => {
    expect(html.textContent).toContain('loginVolumes.coversHint');
    expect(html.textContent).toContain('loginVolumes.coversHintTouch');
  });

  it('i bagliori sono nascosti agli screen reader', () => {
    expect(
      html
        .querySelector('[class*="animate-[login-orb"]')
        ?.parentElement?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('ogni copertina fluttua e non ha parentesi graffe nelle classi', () => {
    const copertine = Array.from(html.querySelectorAll<HTMLElement>('ul > li'));
    expect(copertine.length).toBeGreaterThan(0);
    for (const copertina of copertine) {
      expect(copertina.className).toContain('animate-[login-float');
      expect(copertina.className).not.toMatch(/[{}]/);
    }
  });

  const pausa = () => html.querySelector('button:not(:has(img))') as HTMLButtonElement;
  const statiAnimazione = () =>
    Array.from(
      html.querySelectorAll<HTMLElement>(
        '[class*="animate-[login-float"], [class*="animate-[login-orb"]',
      ),
    ).map((el) => el.style.animationPlayState);

  it('all’inizio le animazioni infinite sono in corso e il bottone offre di fermarle', () => {
    expect(statiAnimazione().every((stato) => stato === 'running')).toBe(true);
    expect(pausa().textContent).toContain('loginVolumes.pauseAnimation');
  });

  it('il bottone ferma le animazioni infinite e un secondo clic le riprende', async () => {
    pausa().click();
    await fixture.whenStable();
    expect(statiAnimazione().every((stato) => stato === 'paused')).toBe(true);
    expect(pausa().textContent).toContain('loginVolumes.resumeAnimation');
    pausa().click();
    await fixture.whenStable();
    expect(statiAnimazione().every((stato) => stato === 'running')).toBe(true);
  });

  it('il bottone di pausa non ha aria-pressed: lo stato lo dice il testo, che cambia', async () => {
    expect(pausa().hasAttribute('aria-pressed')).toBe(false);
    pausa().click();
    await fixture.whenStable();
    expect(pausa().hasAttribute('aria-pressed')).toBe(false);
  });

  it('l’invito a toccare è il suggerimento comune, con la sua icona ferma', () => {
    const invito = html.querySelector('app-hint') as HTMLElement;
    expect(invito.querySelector('ng-icon')?.getAttribute('name')).toBe('matTouchAppOutline');
    expect(invito.querySelector('.animate-pulse')).toBeNull();
  });

  it('le copertine si alternano: una sì e una no partono a metà ciclo', () => {
    const ritardi = Array.from(html.querySelectorAll('li')).map((li) =>
      li.classList.contains('[--delay:calc(var(--float,5s)*-0.5)]') ? 'meta' : 'inizio',
    );
    expect(ritardi).toEqual(['inizio', 'meta', 'inizio', 'meta']);
  });

  it('la pausa non gira le copertine', async () => {
    pausa().click();
    await fixture.whenStable();
    bottoni().forEach((bottone) => expect(bottone.getAttribute('aria-pressed')).toBe('false'));
  });
});
