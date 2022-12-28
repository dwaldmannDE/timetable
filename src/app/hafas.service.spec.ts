import { TestBed } from '@angular/core/testing';

import { HafasService } from './hafas.service';

describe('HafasService', () => {
  let service: HafasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HafasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
