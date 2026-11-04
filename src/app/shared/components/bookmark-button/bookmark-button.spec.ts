import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { describe, expect, it } from 'vitest';
import { BookmarkButton } from './bookmark-button';

@Component({
  imports: [BookmarkButton],
  template: `<button appBookmarkButton type="button" [bookmarked]="salvato()"></button>`,
})
class Host {
  readonly salvato = signal(false);
}

describe('BookmarkButton', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { it: {} },
          translocoConfig: { availableLangs: ['it'], defaultLang: 'it' },
        }),
      ],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, button: fixture.nativeElement.querySelector('button') as HTMLElement };
  };

  it('espone lo stato ai lettori di schermo con aria-pressed e un testo nascosto', async () => {
    const { fixture, button } = setup();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.querySelector('.sr-only')?.textContent).toBe('bookmark.add');

    fixture.componentInstance.salvato.set(true);
    await fixture.whenStable();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.querySelector('.sr-only')?.textContent).toBe('bookmark.remove');
  });

  it('cambia stile quando è salvato', async () => {
    const { fixture, button } = setup();
    expect(button.classList).toContain('bg-surface-950/75');

    fixture.componentInstance.salvato.set(true);
    await fixture.whenStable();
    expect(button.classList).toContain('bg-primary-900/90');
  });
});
