import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { MessageSeverity } from '../../models/message.model';
import { Message } from './message';

@Component({
  imports: [Message],
  template: `<app-message [severity]="tono()" [label]="titolo()" [icon]="icona()"
    >Testo del messaggio</app-message
  >`,
})
class Host {
  readonly tono = signal<MessageSeverity>('info');
  readonly titolo = signal<string | undefined>(undefined);
  readonly icona = signal<string | undefined>(undefined);
}

describe('Message', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const host = () => fixture.componentInstance;
  const contenitore = () => html.querySelector('[role]') as HTMLElement;
  const icona = () => html.querySelector('ng-icon') as HTMLElement;
  const nomeIcona = (): string =>
    fixture.debugElement.query(By.directive(NgIcon)).componentInstance.name();

  const imposta = async (tono: MessageSeverity) => {
    host().tono.set(tono);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(html.querySelector('app-message')).not.toBeNull();
  });

  it('mostra il testo ricevuto come contenuto', () => {
    expect(html.textContent).toContain('Testo del messaggio');
  });

  it('di base è un messaggio informativo', () => {
    expect(nomeIcona()).toBe('matInfoOutline');
    expect(contenitore().className).toContain('border-blue-500/40');
  });

  it('ogni tono ha la sua icona e i suoi colori', async () => {
    const attesi: [MessageSeverity, string, string][] = [
      ['primary', 'matInfoOutline', 'border-primary-400/30'],
      ['info', 'matInfoOutline', 'border-blue-500/40'],
      ['success', 'matCheckCircleOutline', 'border-green-500/40'],
      ['warn', 'matWarningOutline', 'border-amber-500/40'],
      ['error', 'matErrorOutline', 'border-red-500/40'],
    ];
    for (const [tono, nome, bordo] of attesi) {
      await imposta(tono);
      expect(nomeIcona()).toBe(nome);
      expect(contenitore().className).toContain(bordo);
    }
  });

  it("l'icona si può cambiare", async () => {
    host().icona.set('matLockOutline');
    await fixture.whenStable();
    expect(nomeIcona()).toBe('matLockOutline');
  });

  it("l'icona è decorativa, nascosta agli screen reader", () => {
    expect(icona().getAttribute('aria-hidden')).toBe('true');
  });

  it('mostra il titolo in grassetto solo se c’è', async () => {
    expect(html.querySelector('p.font-bold')).toBeNull();
    host().titolo.set('Attenzione ai dati');
    await fixture.whenStable();
    expect(html.querySelector('p.font-bold')?.textContent).toContain('Attenzione ai dati');
  });

  it('errori e avvisi sono annunciati subito, gli altri con calma', async () => {
    const ruoli: [MessageSeverity, string][] = [
      ['error', 'alert'],
      ['warn', 'alert'],
      ['info', 'status'],
      ['success', 'status'],
      ['primary', 'status'],
    ];
    for (const [tono, ruolo] of ruoli) {
      await imposta(tono);
      expect(contenitore().getAttribute('role')).toBe(ruolo);
    }
  });

  it('il tono si sente anche senza vedere i colori, con un testo nascosto', async () => {
    await imposta('error');
    expect(html.querySelector('.sr-only')?.textContent).toContain('message.error');
    await imposta('primary');
    expect(html.querySelector('.sr-only')).toBeNull();
  });
});
