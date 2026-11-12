import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CardFrame } from './card-frame';

@Component({
  imports: [CardFrame],
  template: `
    <app-card-frame [rare]="rare()" [interactive]="interactive()" [compact]="compact()">
      <p>contenuto</p>
    </app-card-frame>
  `,
})
class Host {
  readonly rare = signal(false);
  readonly interactive = signal(false);
  readonly compact = signal(false);
}

describe('CardFrame', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const host = () => fixture.componentInstance;
  const outer = () => html.querySelector('app-card-frame > div') as HTMLElement;
  const inner = () => html.querySelector('app-card-frame > div > div') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(host()).toBeTruthy();
  });

  it('mostra il contenuto dentro la cornice', () => {
    expect(inner().textContent).toContain('contenuto');
  });

  it('di default ha il bordo grigio e nessun effetto al passaggio del mouse', () => {
    expect(outer().classList).toContain('bg-surface-600');
    expect(outer().classList).not.toContain('from-primary-200');
    expect(outer().classList).not.toContain('hover:bg-surface-500');
    expect(outer().classList).not.toContain('active:scale-98');
  });

  it('una carta rara ha il bordo sfumato al posto del grigio, anche se cliccabile', async () => {
    host().rare.set(true);
    host().interactive.set(true);
    await fixture.whenStable();
    expect(outer().classList).toContain('from-primary-200');
    expect(outer().classList).not.toContain('bg-surface-600');
    expect(outer().classList).not.toContain('hover:bg-surface-500');
  });

  it('una carta cliccabile schiarisce il bordo e si preme', async () => {
    host().interactive.set(true);
    await fixture.whenStable();
    expect(outer().classList).toContain('hover:bg-surface-500');
    expect(outer().classList).toContain('active:scale-98');
  });

  it('una carta compatta ha meno margine interno', async () => {
    expect(inner().classList).toContain('p-2');
    host().compact.set(true);
    await fixture.whenStable();
    expect(inner().classList).toContain('p-1');
    expect(inner().classList).not.toContain('p-2');
  });
});
