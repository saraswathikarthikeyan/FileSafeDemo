import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { AuthGuard } from '../auth.guard';
import { HttpClient  } from '@angular/common/http';
import { AutologoutService } from '../services/autologout.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private router:Router, private authGuard: AuthGuard, 
    private autoLogout: AutologoutService, private http:HttpClient ) { }

//Method sets the session and Inits the autoLogout timer();
  setSession(token):void {
    this.autoLogout.init();
    this.authGuard.editLoginStatus('Logout');
    sessionStorage.setItem('isLoggedIn', "true");
    sessionStorage.setItem('token', token);
  }
 

    //Method called on Loin
  login(userModel:User): Boolean {
    if(userModel.username === "saraswathi" && userModel.password === "test") {          
        this.setSession(userModel.username);  
        return true;    
      }
      else {
        return false;
      }
  }

}
