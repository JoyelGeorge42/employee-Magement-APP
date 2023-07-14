import { TestBed } from '@angular/core/testing';

import { TimesheetapiService } from './timesheetapi.service';

describe('TimesheetapiService', () => {
  let service: TimesheetapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimesheetapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
