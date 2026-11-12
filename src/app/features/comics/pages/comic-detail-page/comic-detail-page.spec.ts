import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { ComicsNavigationService } from '../../services/comics-navigation/comics-navigation.service';
import { ComicDetailPage } from './comic-detail-page';

describe('ComicDetailPage', () => {
  let fixture: ComponentFixture<ComicDetailPage>;
  let html: HTMLElement;

  const params = new BehaviorSubject(convertToParamMap({}));

  const create = async (id: string, isMember = true) => {
    TestBed.inject(SessionService).setAuthenticated(isMember);
    params.next(convertToParamMap({ id }));
    fixture = TestBed.createComponent(ComicDetailPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };
  const button = (text: string) =>
    Array.from(html.querySelectorAll('button')).find((b) =>
      b.textContent?.includes(text),
    ) as HTMLButtonElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ComicDetailPage],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { paramMap: params } }],
    }).compileComponents();
  });

  it('viene creata', async () => {
    await create('w1');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra titolo, autore, volume ed edizione del fumetto', async () => {
    await create('w1');
    expect(html.querySelector('h1')?.textContent).toContain('comicDetail.title');
    expect(html.querySelector('h2')?.textContent).toContain('One Piece');
    expect(html.textContent).toContain('Eiichiro Oda');
    expect(html.textContent).toContain('107');
    expect(html.textContent).toContain('/ 110');
    expect(html.querySelector('app-tag')?.textContent).toContain('mangaCard.editions.limited');
  });

  it('ha un pulsante per tornare indietro', async () => {
    await create('w1');
    const back = html.querySelector('button[aria-label="common.back"]') as HTMLButtonElement;
    const goBack = vi.spyOn(TestBed.inject(ComicsNavigationService), 'goBack').mockReturnValue();
    back.click();
    expect(goBack).toHaveBeenCalled();
  });

  it('con la busta sigillata non rivela la posizione in classifica', async () => {
    await create('w1');
    expect(html.textContent).not.toContain('comicDetail.ofTheWeek');
  });

  it('con la busta aperta mostra la posizione della settimana', async () => {
    TestBed.inject(WeeklyPackService).open();
    await create('w1');
    expect(html.textContent).toContain('#1');
    expect(html.textContent).toContain('comicDetail.ofTheWeek');
  });

  it('un fumetto fuori classifica non ha la posizione', async () => {
    TestBed.inject(WeeklyPackService).open();
    await create('d1');
    expect(html.textContent).not.toContain('comicDetail.ofTheWeek');
  });

  it('mostra lo skeleton finché la copertina non è caricata', async () => {
    await create('w1');
    expect(html.querySelector('app-skeleton')).not.toBeNull();
    html.querySelector('img')?.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(html.querySelector('app-skeleton')).toBeNull();
  });

  describe('da isMember', () => {
    it('aggiunge e toglie il volume dalla lista', async () => {
      await create('w1');
      expect(button('comicDetail.addToList').getAttribute('aria-pressed')).toBe('false');

      button('comicDetail.addToList').click();
      await fixture.whenStable();
      expect(TestBed.inject(BookmarksService).isSaved('w1')).toBe(true);
      expect(button('common.inList').getAttribute('aria-pressed')).toBe('true');

      button('common.inList').click();
      await fixture.whenStable();
      expect(TestBed.inject(BookmarksService).isSaved('w1')).toBe(false);
    });

    it("non vede l'avviso per gli ospiti", async () => {
      await create('w1');
      expect(html.querySelector('app-message')).toBeNull();
    });
  });

  describe('da ospite', () => {
    it("al posto di «Aggiungi in lista» c'è l'invito a iscriversi", async () => {
      await create('w1', false);
      expect(button('comicDetail.addToList')).toBeUndefined();
      const invitation = html.querySelector('a[href="/login"]');
      expect(invitation?.textContent).toContain('comicDetail.signUpToSave');
    });

    it("vede il dettaglio con l'avviso che non può salvare", async () => {
      await create('w1', false);
      expect(html.querySelector('h2')?.textContent).toContain('One Piece');
      expect(html.querySelector('app-message')).not.toBeNull();
    });
  });

  describe('condivisione', () => {
    it('usa la condivisione di sistema quando esiste', async () => {
      const share = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { share });
      await create('w1');
      button('comicDetail.share').click();
      await fixture.whenStable();
      expect(share).toHaveBeenCalledWith(expect.objectContaining({ title: 'One Piece' }));
    });

    it('altrimenti copia il link e lo dice', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });
      await create('w1');
      button('comicDetail.share').click();
      await fixture.whenStable();
      expect(writeText).toHaveBeenCalledOnce();
      expect(button('comicDetail.linkCopied')).toBeDefined();
    });
  });

  it('un id sconosciuto mostra il messaggio «non trovato»', async () => {
    await create('non-esiste');
    expect(html.querySelector('app-empty-state')?.textContent).toContain('comicDetail.notFound');
    expect(html.querySelector('img')).toBeNull();
  });
});
