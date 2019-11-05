import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import {By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { FileuploadComponent } from '../fileupload/fileupload.component';
import { User } from '../model/user';

import { Router } from "@angular/router";
import { LoginService } from '../services/login.service';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement:DebugElement;
  let htmlElement:HTMLElement;
  let router:Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent }, 
          { path:'fileupload', component:FileuploadComponent }]),
        FormsModule,ReactiveFormsModule 
      ],
      declarations: [ LoginComponent, FileuploadComponent ],
      providers: [ LoginService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.css('*'));    
    htmlElement = debugElement.nativeElement;
  });

  //Checks the Component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Checks the Login Text
  it('should have text Login',() =>{    
    expect(debugElement.nativeElement.querySelector('h1').textContent).toContain('Login');
  });

  //Checks for the username textbox
  it('UserName textbox Exists',() =>{    
    expect(component.loginFG.controls['username']).toBeTruthy();    
  });

  //Checks for the controls
  it('Password textbox Exists',() =>{    
    expect(component.loginFG.controls['password']).toBeTruthy();      
  });

  it('Login button Exists',() =>{    
    expect(debugElement.nativeElement.querySelector('button').textContent).toContain('Login');
  });

  //Negative Test Case
  xit('Login Button Disabled:False = Should Fail',() =>{   
    expect(debugElement.nativeElement.querySelector('button').disabled).toBeFalsy();
  });

  it('Login button is Disabled:True',() =>{   
    expect(debugElement.nativeElement.querySelector('button').disabled).toBeTruthy();
  });



 //username field validitiy:
 it('UserName Validity',()=>{

  let usernameCtrl = component.loginFG.controls['username'];
  expect(usernameCtrl.valid).toBeFalsy();

  usernameCtrl.setValue("");
  expect(usernameCtrl.hasError('required')).toBeTruthy();

  usernameCtrl.setValue("s");
  expect(usernameCtrl.hasError('minlength')).toBeTruthy();

  usernameCtrl.setValue("sara");
  expect(usernameCtrl.valid).toBeTruthy();

});


 //username field validitiy:
 it('Password Validity',()=>{

  let passowordCntrl = component.loginFG.controls['password'];
  expect(passowordCntrl.valid).toBeFalsy();

  passowordCntrl.setValue("");
  expect(passowordCntrl.hasError('required')).toBeTruthy();

  passowordCntrl.setValue("s");
  expect(passowordCntrl.hasError('minlength')).toBeTruthy();

  passowordCntrl.setValue("test");
  expect(passowordCntrl.valid).toBeTruthy();

});

 //Provide username and password : Enables the login button
it('Validation with userName and password',()=>{

  let usernameCntrl = component.loginFG.controls['username'];
  let passwordCntrl = component.loginFG.controls['password'];

  usernameCntrl.setValue('');
  passwordCntrl.setValue('');

  //Either one Of the Below is Enoguh to Check the Validity.
  expect(component.loginFG.valid).toBeFalsy();
  expect(debugElement.nativeElement.querySelector('button').disabled).toBeTruthy();

  usernameCntrl.setValue('sar');
  passwordCntrl.setValue('');

  //Either one Of the Below is Enoguh to Check the Validity.
  expect(component.loginFG.valid).toBeFalsy();
  expect(debugElement.nativeElement.querySelector('button').disabled).toBeTruthy();

  usernameCntrl.setValue(' ');
  passwordCntrl.setValue('t');

  //Either one Of the Below is Enoguh to Check the Validity.
  expect(component.loginFG.valid).toBeFalsy();
  expect(debugElement.nativeElement.querySelector('button').disabled).toBeTruthy();

  usernameCntrl.setValue(' ');
  passwordCntrl.setValue('t');

  //Either one Of the Below is Enoguh to Check the Validity.
  expect(component.loginFG.valid).toBeFalsy();
  expect(debugElement.nativeElement.querySelector('button').disabled).toBeTruthy();

});

//Provide username and password : Enables the login button
it('Test Submit Form',()=>{

  let userName = 'saraswathi';
  let password = 'test';
 
  //SpyOn Login Service Method
  let loginService = debugElement.injector.get(LoginService);
  let spyLoginMethod = spyOn(loginService, 'login').and.callThrough();

  //Set username & Password
  component.loginFG.controls['username'].setValue(userName);
  component.loginFG.controls['password'].setValue(password);
  fixture.detectChanges();

  //SpyOn Login Button
  let loginButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
  spyOn(component, 'onSubmit').and.callThrough();
  let routerSpy = spyOn(router, 'navigate').and.callThrough();



  //Either one Of the Below is Enoguh to Check the Validity.
  expect(component.loginFG.valid).toBeTruthy();
  expect(loginButton.disabled).toBeFalsy();

  //Trigger Click Event
  loginButton.click();
  fixture.detectChanges();

  //Expect onSubmit method is called.
  expect(component.onSubmit).toHaveBeenCalled();

  
  //Expect to call the service Method: Login  
  expect(spyLoginMethod).toHaveBeenCalledWith(component.loginModel);

  //Expect window redirect to fileupload page
  expect(routerSpy).toHaveBeenCalledWith(['/fileupload']);
  

});

});
