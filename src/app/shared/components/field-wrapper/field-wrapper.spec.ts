import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { FieldWrapper } from './field-wrapper';

@Component({
  imports: [FieldWrapper],
  template: `
    <app-field-wrapper label="login.email" inputId="campo" [errors]="errors()">
      <input id="campo" />
    </app-field-wrapper>
  `,
})
class Host {
  readonly errors = signal<{ kind: string }[]>([]);
}

describe('FieldWrapper', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  const create = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return fixture;
  };

  it('viene creato', async () => {
    expect(await create()).toBeTruthy();
  });

  it('mostra il nome del campo e lo collega al controllo', async () => {
    const label = (await create()).nativeElement.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('login.email');
    expect(label.getAttribute('for')).toBe('campo');
  });

  it('mostra il controllo passato come contenuto', async () => {
    expect((await create()).nativeElement.querySelector('input#campo')).not.toBeNull();
  });

  it('senza errore non mostra nessun messaggio', async () => {
    expect((await create()).nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('con un errore mostra il messaggio con l’id atteso da aria-describedby', async () => {
    const fixture = await create();
    fixture.componentInstance.errors.set([{ kind: 'required' }]);
    await fixture.whenStable();
    const message = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(message.id).toBe('campo-error');
    expect(message.textContent?.trim()).toBe('validation.required');
  });

  it('affianca al messaggio un’icona nascosta agli screen reader', async () => {
    const fixture = await create();
    fixture.componentInstance.errors.set([{ kind: 'required' }]);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('[role="alert"] ng-icon') as HTMLElement;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('toglie il messaggio quando l’errore sparisce', async () => {
    const fixture = await create();
    fixture.componentInstance.errors.set([{ kind: 'required' }]);
    await fixture.whenStable();
    fixture.componentInstance.errors.set([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('nel messaggio scrive il nome del campo con l’iniziale minuscola', async () => {
    TestBed.inject(TranslocoService).setTranslation(
      {
        login: { email: 'Email' },
        validation: { required: 'Il campo {{ name }} è obbligatorio.' },
      },
      'it',
    );
    const fixture = await create();
    fixture.componentInstance.errors.set([{ kind: 'required' }]);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('label')?.textContent?.trim()).toBe('Email');
    expect(html.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'Il campo email è obbligatorio.',
    );
  });

  it('sceglie il messaggio dal tipo di errore', async () => {
    const fixture = await create();
    fixture.componentInstance.errors.set([{ kind: 'email' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent.trim()).toBe(
      'validation.email',
    );
  });

  it('per un tipo di errore sconosciuto usa il messaggio generico', async () => {
    const fixture = await create();
    fixture.componentInstance.errors.set([{ kind: 'mai-visto' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent.trim()).toBe(
      'validation.invalid',
    );
  });
});
