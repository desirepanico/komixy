import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DiscoverFiltersButton } from './discover-filters-button';

describe('DiscoverFiltersButton', () => {
  let fixture: ComponentFixture<DiscoverFiltersButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DiscoverFiltersButton] }).compileComponents();
    fixture = TestBed.createComponent(DiscoverFiltersButton);
    fixture.componentRef.setInput('count', 0);
    await fixture.whenStable();
  });

  const button = () => fixture.nativeElement.querySelector('button') as HTMLButtonElement;

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('è un bottone che apre un dialog, con nome', () => {
    expect(button().getAttribute('aria-haspopup')).toBe('dialog');
    expect(button().getAttribute('aria-label')).toBe('discover.filters.open');
  });

  it('senza filtri non mostra il numero, con i filtri sì', async () => {
    expect(fixture.nativeElement.textContent).not.toMatch(/\d/);
    fixture.componentRef.setInput('count', 3);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('3');
  });

  it('segnala il clic', async () => {
    let pressed = 0;
    fixture.componentInstance.pressed.subscribe(() => pressed++);
    button().click();
    expect(pressed).toBe(1);
  });
});
