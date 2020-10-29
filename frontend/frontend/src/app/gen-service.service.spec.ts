import { TestBed } from '@angular/core/testing';

import { GenServiceService } from './gen-service.service';

describe('GenServiceService', () => {
  let service: GenServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
