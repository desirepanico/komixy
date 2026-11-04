import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LibraryNavigationService } from './library-navigation.service';

describe('LibraryNavigationService', () => {
  let service: LibraryNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(LibraryNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('espone solo la rotta della libreria', () => {
    expect(service.libraryLink).toEqual(['/', 'library']);
  });

  it('va alla libreria', async () => {
    await service.goToLibrary();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'library']);
  });
});
