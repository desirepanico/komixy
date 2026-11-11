import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Tag, TagSeverity } from './tag';

@Component({
  imports: [Tag],
  template: `<app-tag [severity]="severity()">Limitata</app-tag>`,
})
class Host {
  readonly severity = signal<TagSeverity>('primary');
}

describe('Tag', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const crea = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture;
  };

  it('viene creato', async () => {
    expect(await crea()).toBeTruthy();
  });

  it('mostra il testo passato come contenuto', async () => {
    expect((await crea()).nativeElement.textContent.trim()).toBe('Limitata');
  });

  it('è viola per default e neutro con severity secondary', async () => {
    const fixture = await crea();
    const span = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(span.classList).toContain('bg-primary-500');

    fixture.componentInstance.severity.set('secondary');
    await fixture.whenStable();
    expect(span.classList).toContain('bg-surface-700');
    expect(span.classList).not.toContain('bg-primary-500');
  });

  it('con severity accent è viola trasparente con un anello, senza cambiare dimensioni', async () => {
    const fixture = await crea();
    fixture.componentInstance.severity.set('accent');
    await fixture.whenStable();
    const span = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(span.classList).toContain('bg-primary-500/20');
    expect(span.classList).toContain('text-primary-300');
    expect(span.classList).toContain('ring-primary-400/35');
    expect(span.classList).not.toContain('bg-primary-500');
    expect(span.classList).not.toContain('bg-surface-700');
  });
});
