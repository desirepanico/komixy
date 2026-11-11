import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { GuestNotice } from './guest-notice';

@Component({
  imports: [GuestNotice],
  template: `<app-guest-notice message="Come ospite non puoi salvare." />`,
})
class Host {}

describe('GuestNotice', () => {
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('mostra il messaggio ricevuto', () => {
    expect(html.textContent).toContain('Come ospite non puoi salvare.');
  });

  it('invita a iscriversi con un link alla pagina di login', () => {
    const link = html.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/login');
    expect(link.textContent).toContain('guestNotice.signUp');
  });
});
