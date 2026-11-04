import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { matPersonOutline } from '@ng-icons/material-symbols/outline';
import { beforeEach, describe, expect, it } from 'vitest';
import { EmptyState } from './empty-state';

@Component({
  imports: [EmptyState],
  providers: [provideIcons({ matPersonOutline })],
  template: `<app-empty-state icon="matPersonOutline" title="Titolo" description="Descrizione" />`,
})
class Host {}

describe('EmptyState', () => {
  let fixture: ComponentFixture<Host>;
  const html = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(html().querySelector('app-empty-state')).not.toBeNull();
  });

  it('mostra titolo e descrizione', () => {
    expect(html().querySelector('h2')?.textContent).toBe('Titolo');
    expect(html().textContent).toContain('Descrizione');
  });

  it('nasconde l\'icona decorativa ai lettori di schermo', () => {
    expect(html().querySelector('[aria-hidden="true"] ng-icon')).not.toBeNull();
  });
});
