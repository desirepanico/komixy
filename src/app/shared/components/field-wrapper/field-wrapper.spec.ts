import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideTranslocoTesting } from '../../../../testing/test-providers/test-providers';
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
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        provideTranslocoTesting({
          it: {
            login: { email: 'Email' },
            common: {
              validation: {
                required: 'required',
                email: 'email',
                minLength: 'minLength',
                named: 'Il campo {{ field }} è obbligatorio.',
                generic: 'generic',
              },
            },
          },
          en: { common: { validation: { required: 'required-en', generic: 'generic-en' } } },
        }),
      ],
    }).compileComponents();
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
    expect(label.textContent?.trim()).toBe('Email');
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
    expect(messaggio.textContent?.trim()).toBe('required');
  });

  it('affianca al messaggio un’icona nascosta agli screen reader', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'required' }]);
    await fixture.whenStable();
    const icona = fixture.nativeElement.querySelector('[role="alert"] ng-icon') as HTMLElement;
    expect(icona.getAttribute('aria-hidden')).toBe('true');
  });

  it('toglie il messaggio quando l’errore sparisce', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'required' }]);
    await fixture.whenStable();
    fixture.componentInstance.errori.set([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('nel messaggio scrive il nome del campo con l’iniziale minuscola', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'named' }]);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('label')?.textContent?.trim()).toBe('Email');
    expect(html.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'Il campo email è obbligatorio.',
    );
  });

  it('traduce di nuovo il messaggio quando cambia la lingua', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'required' }]);
    await fixture.whenStable();
    const messaggio = () =>
      fixture.nativeElement.querySelector('[role="alert"]').textContent.trim();
    expect(messaggio()).toBe('required');
    TestBed.inject(TranslocoService).setActiveLang('en');
    await fixture.whenStable();
    expect(messaggio()).toBe('required-en');
  });

  it('sceglie il messaggio dal tipo di errore', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'email' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent.trim()).toBe('email');
  });

  it('per un tipo di errore sconosciuto usa il messaggio generico', async () => {
    const fixture = await crea();
    fixture.componentInstance.errori.set([{ kind: 'mai-visto' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent.trim()).toBe(
      'generic',
    );
  });
});
