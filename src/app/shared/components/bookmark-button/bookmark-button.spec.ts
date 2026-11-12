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
  const create = async (isMember: boolean) => {
    TestBed.inject(SessionService).setAuthenticated(isMember);
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
    expect((await create(true)).fixture.componentInstance).toBeTruthy();
  });

  it('per un isMember aggiunge e toglie il fumetto dalla lista', async () => {
    const { fixture, html } = await create(true);
    const button = () => html.querySelector('button') as HTMLButtonElement;
    expect(button().getAttribute('aria-pressed')).toBe('false');
    expect(button().getAttribute('aria-label')).toBe('bookmark.add');

    button().click();
    await fixture.whenStable();
    expect(button().getAttribute('aria-pressed')).toBe('true');
    expect(button().getAttribute('aria-label')).toBe('bookmark.remove');

    button().click();
    await fixture.whenStable();
    expect(button().getAttribute('aria-pressed')).toBe('false');
  });

  it('per un ospite è un link col lucchetto che porta a iscriversi', async () => {
    const { html } = await create(false);
    expect(html.querySelector('button')).toBeNull();
    const link = html.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/login');
    expect(link.getAttribute('aria-label')).toBe('bookmark.signUp');
  });

  it('il lucchetto dell’ospite non diventa trasparente al passaggio del mouse, così resta visibile sulla copertina', async () => {
    const { html } = await create(false);
    const classes = (html.querySelector('a') as HTMLAnchorElement).className;
    expect(classes).toContain('hover:bg-surface-800');
    expect(classes).not.toContain('hover:bg-primary-400/15');
  });
});
