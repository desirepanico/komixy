import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgIcon } from '@ng-icons/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { MessageSeverity } from '../../models/message.model';
import { Message } from './message';

@Component({
  imports: [Message],
  template: `<app-message [severity]="tone()" [label]="text()" [icon]="icon()">
    @if (conLink()) {
      <a href="/login">Iscriviti</a>
    }
  </app-message>`,
})
class Host {
  readonly tone = signal<MessageSeverity>('info');
  readonly text = signal<string | undefined>('Testo del messaggio');
  readonly conLink = signal(false);
  readonly icon = signal<string | undefined>(undefined);
}

describe('Message', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const host = () => fixture.componentInstance;
  const container = () => html.querySelector('[role]') as HTMLElement;
  const icon = () => html.querySelector('ng-icon') as HTMLElement;
  const iconName = (): string =>
    fixture.debugElement.query(By.directive(NgIcon)).componentInstance.name();

  const set = async (tone: MessageSeverity) => {
    host().tone.set(tone);
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

  it('mostra il testo ricevuto in label', () => {
    expect(html.textContent).toContain('Testo del messaggio');
  });

  it('di base è un messaggio informativo', () => {
    expect(iconName()).toBe('matInfoOutline');
    expect(container().className).toContain('border-blue-500/40');
  });

  it('ogni tono ha la sua icona e i suoi colori', async () => {
    const expected: [MessageSeverity, string, string][] = [
      ['primary', 'matInfoOutline', 'border-primary-400/30'],
      ['info', 'matInfoOutline', 'border-blue-500/40'],
      ['success', 'matCheckCircleOutline', 'border-green-500/40'],
      ['warn', 'matWarningOutline', 'border-amber-500/40'],
      ['error', 'matErrorOutline', 'border-red-500/40'],
    ];
    for (const [tone, name, border] of expected) {
      await set(tone);
      expect(iconName()).toBe(name);
      expect(container().className).toContain(border);
    }
  });

  it("l'icona si può cambiare", async () => {
    host().icon.set('matLockOutline');
    await fixture.whenStable();
    expect(iconName()).toBe('matLockOutline');
  });

  it("l'icona è decorativa, nascosta agli screen reader", () => {
    expect(icon().getAttribute('aria-hidden')).toBe('true');
  });

  it('se serve, mostra anche il contenuto dopo il testo, per esempio un link', async () => {
    host().conLink.set(true);
    await fixture.whenStable();
    const paragraph = html.querySelector('p') as HTMLElement;
    expect(paragraph.textContent).toContain('Testo del messaggio');
    expect(paragraph.querySelector('a')?.textContent).toContain('Iscriviti');
  });

  it('funziona anche con il solo contenuto, senza label', async () => {
    host().text.set(undefined);
    host().conLink.set(true);
    await fixture.whenStable();
    expect(html.querySelector('p a')?.textContent).toContain('Iscriviti');
  });

  it('mostra il testo cambiando label', async () => {
    host().text.set('Un altro testo');
    await fixture.whenStable();
    expect(html.textContent).toContain('Un altro testo');
    expect(html.textContent).not.toContain('Testo del messaggio');
  });

  it('errori e avvisi sono annunciati subito, gli altri con calma', async () => {
    const roles: [MessageSeverity, string][] = [
      ['error', 'alert'],
      ['warn', 'alert'],
      ['info', 'status'],
      ['success', 'status'],
      ['primary', 'status'],
    ];
    for (const [tone, ruolo] of roles) {
      await set(tone);
      expect(container().getAttribute('role')).toBe(ruolo);
    }
  });

  it('il tono si sente anche senza vedere i colori, con un testo nascosto', async () => {
    await set('error');
    expect(html.querySelector('.sr-only')?.textContent).toContain('message.error');
    await set('primary');
    expect(html.querySelector('.sr-only')).toBeNull();
  });
});
