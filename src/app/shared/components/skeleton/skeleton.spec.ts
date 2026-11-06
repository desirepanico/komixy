import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  let fixture: ComponentFixture<Skeleton>;
  const host = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Skeleton] }).compileComponents();
    fixture = TestBed.createComponent(Skeleton);
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('è nascosto ai lettori di schermo', () => {
    expect(host().getAttribute('aria-hidden')).toBe('true');
  });

  it('pulsa, tranne con "riduci movimento"', () => {
    expect(host().classList).toContain('animate-pulse');
    expect(host().classList).toContain('motion-reduce:animate-none');
  });
});
