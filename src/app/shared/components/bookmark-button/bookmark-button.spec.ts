import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { SessionService } from '../../services/session/session.service';
import { BookmarkButton } from './bookmark-button';

@Component({
  imports: [BookmarkButton],
  template: `<app-bookmark-button comicId="w1" />`,
})
class Host {}

describe('BookmarkButton', () => {
  const crea = async (iscritto: boolean) => {
    TestBed.inject(SessionService).setAuthenticated(iscritto);
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, html: fixture.nativeElement as HTMLElement };
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('viene creato', async () => {
    expect((await crea(true)).fixture.componentInstance).toBeTruthy();
  });

  it("per un iscritto aggiunge e toglie il fumetto dalla lista", async () => {
    const { fixture, html } = await crea(true);
    const bottone = () => html.querySelector('button') as HTMLButtonElement;
    expect(bottone().getAttribute('aria-pressed')).toBe('false');
    expect(bottone().getAttribute('aria-label')).toBe('bookmark.add');

    bottone().click();
    await fixture.whenStable();
    expect(bottone().getAttribute('aria-pressed')).toBe('true');
    expect(bottone().getAttribute('aria-label')).toBe('bookmark.remove');

    bottone().click();
    await fixture.whenStable();
    expect(bottone().getAttribute('aria-pressed')).toBe('false');
  });

  it("per un ospite è un link col lucchetto che porta a iscriversi", async () => {
    const { html } = await crea(false);
    expect(html.querySelector('button')).toBeNull();
    const link = html.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/login');
    expect(link.getAttribute('aria-label')).toBe('bookmark.signUp');
  });
});
