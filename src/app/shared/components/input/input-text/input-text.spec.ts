import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputText } from './input-text';

@Component({
  imports: [InputText],
  template: `
    <app-input-text
      label="login.email"
      inputId="campo"
      type="email"
      [errors]="errori()"
      placeholder="login.emailPlaceholder"
      autocomplete="email"
      [(value)]="testo"
      [touched]="touched()"
      [required]="obbligatorio()"
      [disabled]="disabled()"
      (touch)="segnaTocco()"
    />
  `,
})
class Host {
  readonly testo = signal('');
  readonly errori = signal<{ kind: string }[]>([]);
  readonly touched = signal(false);
  readonly obbligatorio = signal(false);
  readonly disabled = signal(false);
  readonly tocchi = signal(0);

  segnaTocco(): void {
    this.tocchi.update((n) => n + 1);
  }
}

describe('InputText', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const crea = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const campo = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    return { fixture, host: fixture.componentInstance, campo };
  };

  it('viene creato', async () => {
    expect((await crea()).fixture).toBeTruthy();
  });

  it('mostra il nome del campo collegato al campo', async () => {
    const { fixture, campo } = await crea();
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('login.email');
    expect(label.getAttribute('for')).toBe(campo.id);
  });

  it('imposta id, tipo, segnaposto e autocomplete sul campo', async () => {
    const { campo } = await crea();
    expect(campo.id).toBe('campo');
    expect(campo.type).toBe('email');
    expect(campo.getAttribute('placeholder')).toBe('login.emailPlaceholder');
    expect(campo.getAttribute('autocomplete')).toBe('email');
  });

  it('aggiorna il valore mentre si scrive', async () => {
    const { fixture, host, campo } = await crea();
    campo.value = 'a@b.it';
    campo.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(host.testo()).toBe('a@b.it');
  });

  it('mostra nel campo il valore del modello', async () => {
    const { fixture, host, campo } = await crea();
    host.testo.set('x@y.it');
    await fixture.whenStable();
    expect(campo.value).toBe('x@y.it');
  });

  it('segnala che è stato toccato quando si esce dal campo', async () => {
    const { fixture, host, campo } = await crea();
    campo.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(host.tocchi()).toBe(1);
  });

  it('non segnala l’errore finché il campo non è stato toccato', async () => {
    const { fixture, host, campo } = await crea();
    host.errori.set([{ kind: 'required' }]);
    await fixture.whenStable();
    expect(campo.getAttribute('aria-invalid')).toBe('false');
    expect(campo.getAttribute('aria-describedby')).toBeNull();
  });

  it('segnala l’errore e lo collega al messaggio quando è toccato e non valido', async () => {
    const { fixture, host, campo } = await crea();
    host.errori.set([{ kind: 'required' }]);
    host.touched.set(true);
    await fixture.whenStable();
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(campo.getAttribute('aria-describedby')).toBe('campo-error');
  });

  it('si disabilita quando il campo è disabilitato', async () => {
    const { fixture, host, campo } = await crea();
    host.disabled.set(true);
    await fixture.whenStable();
    expect(campo.disabled).toBe(true);
  });

  it('non mostra il messaggio finché il campo non è stato toccato', async () => {
    const { fixture, host } = await crea();
    host.errori.set([{ kind: 'required' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('mostra il messaggio dell’errore, scelto dal suo kind, dopo il tocco', async () => {
    const { fixture, host } = await crea();
    host.touched.set(true);
    host.errori.set([{ kind: 'required' }]);
    await fixture.whenStable();
    const messaggio = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(messaggio.id).toBe('campo-error');
    expect(messaggio.textContent?.trim()).toBe('validation.required');
  });

  it('senza bottone occhio se non è una password', async () => {
    expect((await crea()).fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('segnala ai lettori di schermo che il campo è obbligatorio', async () => {
    const { fixture, host, campo } = await crea();
    expect(campo.getAttribute('aria-required')).toBeNull();

    host.obbligatorio.set(true);
    await fixture.whenStable();
    expect(campo.getAttribute('aria-required')).toBe('true');
  });
});
