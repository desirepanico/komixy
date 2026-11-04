import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <button id="pieno" appButton>Ok</button>
    <button id="bordo" appButton variant="outlined" [rounded]="true">Ok</button>
    <button id="icona" appButton [iconOnly]="true" aria-label="Chiudi"></button>
    <a id="link" appButton href="/x">Vai</a>
  `,
})
class Host {}

describe('Button', () => {
  const el = (id: string) => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  };

  it('è pieno viola con angoli arrotondati per default', () => {
    const classi = el('pieno').classList;
    expect(classi).toContain('bg-primary-500');
    expect(classi).toContain('rounded-xl');
  });

  it('con variant outlined ha solo il bordo, e con rounded è a pillola', () => {
    const classi = el('bordo').classList;
    expect(classi).toContain('border-primary-400');
    expect(classi).not.toContain('bg-primary-500');
    expect(classi).toContain('rounded-full');
  });

  it('con iconOnly è un quadrato di sola icona', () => {
    expect(el('icona').classList).toContain('size-10');
  });

  it('funziona anche su un link e mostra il contenuto', () => {
    const link = el('link');
    expect(link.classList).toContain('bg-primary-500');
    expect(link.textContent?.trim()).toBe('Vai');
  });
});
