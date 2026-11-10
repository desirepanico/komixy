import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideTranslocoTesting } from '../../../../testing/test-providers/test-providers';
import { ErrorMessage } from './error-message';

@Component({
  imports: [ErrorMessage],
  template: `<app-error-message [errors]="errori()" field="email" />`,
})
class Host {
  readonly errori = signal<{ kind: string; minLength?: number }[]>([{ kind: 'required' }]);
}

describe('ErrorMessage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        provideTranslocoTesting({
          it: {
            common: {
              validation: {
                required: 'Il campo {{ field }} è obbligatorio.',
                minLength: 'Almeno {{ minLength }} caratteri.',
                generic: 'Il campo {{ field }} non è valido.',
              },
            },
          },
          en: { common: { validation: { required: 'The {{ field }} field is required.' } } },
        }),
      ],
    }).compileComponents();
  });

  const crea = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      host: fixture.componentInstance,
      icona: () => html.querySelector('ng-icon'),
      messaggio: () => html.querySelector('span')?.textContent?.trim(),
      elemento: html.querySelector('app-error-message') as HTMLElement,
    };
  };

  it('viene creato', async () => {
    expect((await crea()).fixture).toBeTruthy();
  });

  it('è un avviso annunciato dagli screen reader', async () => {
    expect((await crea()).elemento.getAttribute('role')).toBe('alert');
  });

  it('scrive il messaggio del tipo di errore con il nome del campo', async () => {
    expect((await crea()).messaggio()).toBe('Il campo email è obbligatorio.');
  });

  it('passa le proprietà dell’errore come parametri', async () => {
    const { fixture, host, messaggio } = await crea();
    host.errori.set([{ kind: 'minLength', minLength: 6 }]);
    await fixture.whenStable();
    expect(messaggio()).toBe('Almeno 6 caratteri.');
  });

  it('per un tipo di errore sconosciuto usa il messaggio generico', async () => {
    const { fixture, host, messaggio } = await crea();
    host.errori.set([{ kind: 'mai-visto' }]);
    await fixture.whenStable();
    expect(messaggio()).toBe('Il campo email non è valido.');
  });

  it('affianca al messaggio un’icona nascosta agli screen reader', async () => {
    expect((await crea()).icona()?.getAttribute('aria-hidden')).toBe('true');
  });

  it('traduce di nuovo il messaggio quando cambia la lingua', async () => {
    const { fixture, messaggio } = await crea();
    TestBed.inject(TranslocoService).setActiveLang('en');
    await fixture.whenStable();
    expect(messaggio()).toBe('The email field is required.');
  });
});
