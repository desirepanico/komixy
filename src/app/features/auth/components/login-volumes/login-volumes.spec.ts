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
    const text = html.textContent ?? '';
    expect(text).toContain('loginVolumes.title');
    expect(text).toContain('loginVolumes.subtitle');
  });

  const buttons = () => Array.from(html.querySelectorAll<HTMLButtonElement>('button:has(img)'));
  const press = async (indice: number) => {
    buttons()[indice].click();
    await fixture.whenStable();
  };
  const back = (indice: number) =>
    buttons()[indice].querySelector('[aria-hidden]:last-child') as HTMLElement;

  it('mostra quattro copertine, ognuna un bottone con il suo testo alternativo tradotto', () => {
    expect(buttons()).toHaveLength(4);
    buttons().forEach((button) => {
      expect(button.querySelector('img')?.getAttribute('alt')).toBe('mangaCard.coverAlt');
      expect(button.getAttribute('aria-pressed')).toBe('false');
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
    const text = back(0).textContent ?? '';
    expect(text).toContain('One Piece');
    expect(text).toContain('Eiichiro Oda');
    expect(text).toContain('loginVolumes.kind.manga');
    expect(back(1).textContent).toContain('loginVolumes.kind.comic');
  });

  it('all’inizio il retro è nascosto agli screen reader', () => {
    expect(back(0).getAttribute('aria-hidden')).toBe('true');
  });

  it('un clic gira la copertina e mostra il retro agli screen reader', async () => {
    await press(0);
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons()[0].querySelector('.rotate-y-180')).not.toBeNull();
    expect(back(0).getAttribute('aria-hidden')).toBe('false');
  });

  it('un secondo clic la rigira', async () => {
    await press(0);
    await press(0);
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('false');
    expect(back(0).getAttribute('aria-hidden')).toBe('true');
  });

  it('la copertina girata passa in primo piano e, rigirata, torna al suo posto', async () => {
    const card = () => buttons()[0].closest('li') as HTMLElement;
    expect(card().classList).not.toContain('z-20!');
    await press(0);
    expect(card().classList).toContain('z-20!');
    await press(0);
    expect(card().classList).not.toContain('z-20!');
  });

  const touch = async (indice: number) => {
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'pointerType', { value: 'touch' });
    buttons()[indice].dispatchEvent(event);
    await fixture.whenStable();
  };

  it('con il dito il primo tocco porta il volume in avanti senza girarlo', async () => {
    await touch(0);
    const card = buttons()[0].closest('li') as HTMLElement;
    expect(card.classList).toContain('z-30!');
    expect(buttons()[0].classList).toContain('scale-110');
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('con il dito il secondo tocco gira il volume e un terzo lo rigira', async () => {
    await touch(0);
    await touch(0);
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('true');
    await touch(0);
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('con il dito toccare un altro volume sposta la selezione senza girarlo', async () => {
    await touch(0);
    await touch(1);
    expect(buttons()[0].classList).not.toContain('scale-110');
    expect(buttons()[1].classList).toContain('scale-110');
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('con mouse e tastiera il clic gira subito e porta in avanti', async () => {
    await press(0);
    expect(buttons()[0].getAttribute('aria-pressed')).toBe('true');
    expect((buttons()[0].closest('li') as HTMLElement).classList).toContain('z-30!');
  });

  it('con l’hover una copertina passa davanti anche a quella scelta con il clic', async () => {
    await press(0);
    const card = buttons()[1].closest('li') as HTMLElement;
    expect(card.classList).toContain('hover:z-50!');
  });

  it('girare una copertina non cambia le altre', async () => {
    await press(0);
    expect(buttons()[1].getAttribute('aria-pressed')).toBe('false');
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
    const covers = Array.from(html.querySelectorAll<HTMLElement>('ul > li'));
    expect(covers.length).toBeGreaterThan(0);
    for (const cover of covers) {
      expect(cover.className).toContain('animate-[login-float');
      expect(cover.className).not.toMatch(/[{}]/);
    }
  });

  const pause = () => html.querySelector('button:not(:has(img))') as HTMLButtonElement;
  const animationStates = () =>
    Array.from(
      html.querySelectorAll<HTMLElement>(
        '[class*="animate-[login-float"], [class*="animate-[login-orb"]',
      ),
    ).map((el) => el.style.animationPlayState);

  it('all’inizio le animazioni infinite sono in corso e il bottone offre di fermarle', () => {
    expect(animationStates().every((stato) => stato === 'running')).toBe(true);
    expect(pause().textContent).toContain('loginVolumes.pauseAnimation');
  });

  it('il bottone ferma le animazioni infinite e un secondo clic le riprende', async () => {
    pause().click();
    await fixture.whenStable();
    expect(animationStates().every((stato) => stato === 'paused')).toBe(true);
    expect(pause().textContent).toContain('loginVolumes.resumeAnimation');
    pause().click();
    await fixture.whenStable();
    expect(animationStates().every((stato) => stato === 'running')).toBe(true);
  });

  it('il bottone di pausa non ha aria-pressed: lo stato lo dice il testo, che cambia', async () => {
    expect(pause().hasAttribute('aria-pressed')).toBe(false);
    pause().click();
    await fixture.whenStable();
    expect(pause().hasAttribute('aria-pressed')).toBe(false);
  });

  it('l’invito a toccare è il suggerimento comune, con la sua icona ferma', () => {
    const invitation = html.querySelector('app-hint') as HTMLElement;
    expect(invitation.querySelector('ng-icon')?.getAttribute('name')).toBe('matTouchAppOutline');
    expect(invitation.querySelector('.animate-pulse')).toBeNull();
  });

  it('le copertine si alternano: una sì e una no partono a metà ciclo', () => {
    const delays = Array.from(html.querySelectorAll('li')).map((li) =>
      li.classList.contains('[--delay:calc(var(--float,5s)*-0.5)]') ? 'meta' : 'inizio',
    );
    expect(delays).toEqual(['inizio', 'meta', 'inizio', 'meta']);
  });

  it('la pausa non gira le copertine', async () => {
    pause().click();
    await fixture.whenStable();
    buttons().forEach((button) => expect(button.getAttribute('aria-pressed')).toBe('false'));
  });
});
