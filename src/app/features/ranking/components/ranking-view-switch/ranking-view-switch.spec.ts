import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { RankingView } from '../../models/ranking-view.model';
import { RankingViewSwitch } from './ranking-view-switch';

@Component({
  imports: [RankingViewSwitch],
  template: `<app-ranking-view-switch [(view)]="vista" />`,
})
class Host {
  readonly vista = signal<RankingView>('list');
}

describe('RankingViewSwitch', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const bottoni = () => Array.from(html.querySelectorAll('button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ha le voci Elenco e Carte, con la vista attuale premuta', () => {
    expect(bottoni().map((b) => b.textContent?.trim())).toEqual(['ranking.list', 'ranking.cards']);
    expect(bottoni().map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
  });

  it('è un gruppo con un nome', () => {
    const gruppo = html.querySelector('[role="group"]');
    expect(gruppo?.getAttribute('aria-label')).toBe('ranking.viewLabel');
  });

  it('scegliendo una voce cambia la vista del genitore', async () => {
    bottoni()[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.vista()).toBe('cards');
    expect(bottoni().map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);

    bottoni()[0].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.vista()).toBe('list');
  });
});
