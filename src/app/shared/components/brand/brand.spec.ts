import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Brand } from './brand';

describe('Brand', () => {
  let fixture: ComponentFixture<Brand>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brand],
    }).compileComponents();
    fixture = TestBed.createComponent(Brand);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra il nome Komixy', () => {
    expect(html.textContent?.trim()).toBe('Komixy');
  });

  it('ha la X in viola', () => {
    expect(html.querySelector('span span')?.textContent).toBe('x');
    expect(html.querySelector('span span')?.classList).toContain('text-primary-400');
  });

  it('mostra il logo come immagine decorativa', () => {
    const logo = html.querySelector('img');
    expect(logo?.getAttribute('src')).toContain('komixy-logo.png');
    expect(logo?.getAttribute('alt')).toBe('');
  });
});
