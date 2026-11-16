import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicFormat } from '@shared/models/catalog-item.model';
import { FormatIllustration } from './format-illustration';

@Component({
  imports: [FormatIllustration],
  template: `<app-format-illustration [format]="format()" />`,
})
class Host {
  public readonly format = signal<ComicFormat>('series');
}

describe('FormatIllustration', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  const groups = (): number => fixture.nativeElement.querySelectorAll('svg g').length;

  it('la serie ha quattro volumi che crescono', () => {
    expect(groups()).toBe(4);
  });

  it('il volume unico e la graphic novel hanno un solo libro', async () => {
    for (const format of ['oneShot', 'graphicNovel'] as const) {
      fixture.componentInstance.format.set(format);
      await fixture.whenStable();
      expect(groups()).toBe(1);
    }
  });

  it("l'omnibus ha due volumi impilati", async () => {
    fixture.componentInstance.format.set('omnibus');
    await fixture.whenStable();
    expect(groups()).toBe(2);
  });

  it('è decorativa per i lettori di schermo', () => {
    expect(
      fixture.nativeElement.querySelector('app-format-illustration').getAttribute('aria-hidden'),
    ).toBe('true');
  });
});
