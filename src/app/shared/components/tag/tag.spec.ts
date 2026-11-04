import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Tag, TagSeverity } from './tag';

@Component({
  imports: [Tag],
  template: `<app-tag [severity]="severity()">Limitata</app-tag>`,
})
class Host {
  readonly severity = signal<TagSeverity>('primary');
}

describe('Tag', () => {
  const crea = () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  };

  it('mostra il testo passato come contenuto', () => {
    expect(crea().nativeElement.textContent.trim()).toBe('Limitata');
  });

  it('è viola per default e neutro con severity secondary', async () => {
    const fixture = crea();
    const span = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(span.classList).toContain('bg-primary-500');

    fixture.componentInstance.severity.set('secondary');
    await fixture.whenStable();
    expect(span.classList).toContain('bg-surface-700');
    expect(span.classList).not.toContain('bg-primary-500');
  });
});
