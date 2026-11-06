import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FieldWrapper } from './field-wrapper';

@Component({
  imports: [FieldWrapper],
  template: `
    <app-field-wrapper label="login.email" inputId="campo" [errors]="errori()">
      <input id="campo" />
    </app-field-wrapper>
  `,
})
class Host {
  readonly errori = signal<{ kind: string }[]>([]);
}

describe('FieldWrapper', () => {
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

  it('mostra il nome del campo e lo collega al controllo', async () => {
    const label = (await crea()).nativeElement.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('login.email');
    expect(label.getAttribute('for')).toBe('campo');
  });

  it('mostra il controllo passato come contenuto', async () => {
    expect((await crea()).nativeElement.querySelector('input#campo')).not.toBeNull();
  });

  it('senza errore non mostra nessun messaggio', async () => {
    expect((await crea()).nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('con un errore mostra il messaggio con l’id atteso da aria-describedby', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'required' }]);
    await fixture.whenStable();
    const messaggio = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(messaggio.id).toBe('campo-error');
    expect(messaggio.textContent?.trim()).toBe('validation.required');
  });

  it('toglie il messaggio quando l’errore sparisce', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'required' }]);
    await fixture.whenStable();
    fixture.componentInstance.errori.set([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('sceglie il messaggio dal tipo di errore', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'email' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent.trim()).toBe(
      'validation.email',
    );
  });

  it('per un tipo di errore sconosciuto usa il messaggio generico', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'mai-visto' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent.trim()).toBe(
      'validation.invalid',
    );
  });
});
