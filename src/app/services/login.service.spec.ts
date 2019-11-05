import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginService } from './login.service';
import { User } from '../model/user';


describe('LoginService', () => {

  let userModel:User;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,

      RouterTestingModule.withRoutes([])
    ]
  }));

  it('should be created', () => {
    const service: LoginService = TestBed.get(LoginService);
    expect(service).toBeTruthy();
  });


  xit('Incorrect username/passord',()=>{

    userModel.username = "saraswathi";
    userModel.password = "test";

  });

});
