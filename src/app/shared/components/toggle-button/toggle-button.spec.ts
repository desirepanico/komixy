import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ToggleButton } from './toggle-button';

@Component({
  imports: [ToggleButton],
  template: `
    <button id="toggle" appToggleButton type="button" [pressed]="pressed()" aria-label="Salva">
      Ok
    </button>
  `,
})
class Host {
  public readonly pressed = signal(false);
}

describe('ToggleButton', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const crea = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const toggle = fixture.nativeElement.querySelector('#toggle') as HTMLButtonElement;
    return { fixture, toggle };
  };

  it('viene creato e mostra il contenuto', async () => {
    const { toggle } = await crea();
    expect(toggle.textContent?.trim()).toBe('Ok');
  });

  it('spento ha sfondo viola scuro semitrasparente e bordo neutro e aria-pressed false', async () => {
    const { toggle } = await crea();
    expect(toggle.classList).toContain('bg-primary-950/75');
    expect(toggle.classList).toContain('border-surface-700');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });

  it('acceso ha bordo viola e aria-pressed true', async () => {
    const { fixture, toggle } = await crea();
    fixture.componentInstance.pressed.set(true);
    await fixture.whenStable();
    expect(toggle.classList).toContain('bg-primary-900');
    expect(toggle.classList).toContain('border-primary-500');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('è sempre un cerchio', async () => {
    const { toggle } = await crea();
    expect(toggle.classList).toContain('rounded-full');
  });
});
