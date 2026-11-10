import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('contiene i messaggi toast una sola volta', () => {
    expect(fixture.nativeElement.querySelectorAll('app-toast')).toHaveLength(1);
  });

  it("contiene l'area dove il router mostra le pagine", () => {
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });
});
