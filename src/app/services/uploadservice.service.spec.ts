import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UploadserviceService } from './uploadservice.service';

describe('UploadserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: UploadserviceService = TestBed.get(UploadserviceService);
    expect(service).toBeTruthy();
  });
});
