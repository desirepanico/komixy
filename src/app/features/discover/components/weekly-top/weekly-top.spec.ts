import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { WeeklyTop } from './weekly-top';

describe('WeeklyTop', () => {
  let fixture: ComponentFixture<WeeklyTop>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyTop],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(WeeklyTop);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il titolo con il numero di volumi', () => {
    expect(html.querySelector('h2')?.textContent).toContain('weeklyPack.topTitle');
  });

  it('mostra i primi tre volumi, dal 1º al 3º, ognuno con il link al suo dettaglio', () => {
    const link = Array.from(html.querySelectorAll('ul a')) as HTMLAnchorElement[];
    expect(link).toHaveLength(3);
    expect(link.map((a) => a.textContent?.match(/\d+/)?.[0])).toEqual(['1', '2', '3']);
    expect(link.every((a) => a.getAttribute('href')?.startsWith('/comic/'))).toBe(true);
  });

  it('ha il link alla classifica completa', () => {
    expect(html.querySelector('a[href="/discover/ranking"]')?.textContent).toContain(
      'weeklyPack.seeRanking',
    );
  });
});
