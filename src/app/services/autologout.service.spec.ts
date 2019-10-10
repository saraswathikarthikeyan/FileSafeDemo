import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AutologoutService } from './autologout.service';

describe('AutologoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([])
    ]
  }));

  it('should be created', () => {
    const service: AutologoutService = TestBed.get(AutologoutService);
    expect(service).toBeTruthy();
  });
});
