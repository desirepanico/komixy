import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <button id="pieno" appButton>Ok</button>
    <button id="bordo" appButton variant="outlined" [rounded]="true">Ok</button>
    <button id="icona" appButton [iconOnly]="true" aria-label="Chiudi"></button>
    <button id="testo-icona" appButton variant="text" [iconOnly]="true" aria-label="Mostra"></button>
    <button id="testo" appButton variant="text" class="px-3">Ok</button>
    <button id="secondario" appButton severity="secondary">Ok</button>
    <button id="secondario-bordo" appButton severity="secondary" variant="outlined">Ok</button>
    <button id="pericolo" appButton severity="danger">Ok</button>
    <button id="pericolo-bordo" appButton severity="danger" variant="outlined">Ok</button>
    <button id="pericolo-testo" appButton severity="danger" variant="text">Ok</button>
    <a id="link" appButton href="/x">Vai</a>
  `,
})
class Host {}

describe('Button', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const el = async (id: string) => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  };

  it('viene creato', async () => {
    expect(await el('pieno')).toBeTruthy();
  });

  it('è pieno viola con angoli arrotondati per default', async () => {
    const classi = (await el('pieno')).classList;
    expect(classi).toContain('bg-primary-300');
    expect(classi).toContain('rounded-sm');
  });

  it('con variant outlined ha solo il bordo, e con rounded è a pillola', async () => {
    const classi = (await el('bordo')).classList;
    expect(classi).toContain('border-primary-400');
    expect(classi).not.toContain('bg-primary-300');
    expect(classi).toContain('rounded-full');
  });

  it('con iconOnly è un quadrato di sola icona', async () => {
    expect((await el('icona')).classList).toContain('size-10');
  });

  it('con variant text e iconOnly mantiene dimensione e centratura dell icona', async () => {
    const classi = (await el('testo-icona')).classList;
    expect(classi).toContain('size-10');
    expect(classi).toContain('justify-center');
    expect(classi).not.toContain('bg-primary-300');
  });

  it('con variant text non ha sfondo né bordo e lascia le spaziature a chi lo usa', async () => {
    const classi = (await el('testo')).classList;
    expect(classi).not.toContain('bg-primary-300');
    expect(classi).not.toContain('border');
    expect(classi).not.toContain('px-4');
  });

  it('con severity secondary è neutro, non viola', async () => {
    const classi = (await el('secondario')).classList;
    expect(classi).toContain('bg-surface-800');
    expect(classi).not.toContain('bg-primary-300');
  });

  it('con severity secondary e variant outlined ha il bordo neutro', async () => {
    const classi = (await el('secondario-bordo')).classList;
    expect(classi).toContain('border-surface-600');
    expect(classi).not.toContain('border-primary-400');
  });

  it('con severity danger usa i colori rosa in tutte le varianti', async () => {
    expect((await el('pericolo')).classList).toContain('bg-rose-400');
    expect((await el('pericolo-bordo')).classList).toContain('border-rose-300');
    expect((await el('pericolo-testo')).classList).toContain('text-red-400');
  });

  it('funziona anche su un link e mostra il contenuto', async () => {
    const link = await el('link');
    expect(link.classList).toContain('bg-primary-300');
    expect(link.textContent?.trim()).toBe('Vai');
  });
});
