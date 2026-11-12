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

  it('mostra il logo con il nome Komixy', () => {
    const logo = html.querySelector('img');
    expect(logo?.getAttribute('src')).toContain('komixy-logo-wordmark.png');
    expect(logo?.getAttribute('alt')).toBe('common.brand');
  });
});
