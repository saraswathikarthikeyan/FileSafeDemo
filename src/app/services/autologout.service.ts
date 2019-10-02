import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, fromEvent,from, merge, Observable,throwError  } from 'rxjs';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';


const MINUTES_UNITL_AUTO_LOGOUT = 5 // in mins
const CHECK_INTERVAL =15000 // in ms
const STORE_KEY =  'lastAction';


@Injectable({
  providedIn: 'root'
})
export class AutologoutService {

  subscription : Subscription;
  handle;

  public getLastAction():number {
    return parseInt(sessionStorage.getItem(STORE_KEY));
  }

  public setLastAction(lastAction: number):void {
  sessionStorage.setItem(STORE_KEY, lastAction.toString());
  }

  constructor(private router: Router, private authGuard:AuthGuard,private http:HttpClient) { 
    //console.log('Inside constructor');
    this.check();
    this.initListener();
    this.initInterval();     
    this.setLoginStatus();     
  }

  //resets the timer on every user action
  reset():void {
    this.setLastAction(Date.now());
  }

  init():void {
    sessionStorage.setItem('lastAction',Date.now().toString());
    this.check();
    this.initListener();
    this.initInterval();
 }

  
initListener():void {
//Events that has to be Monitored.
const  events = [
    'scroll',
    'wheel',
    'touchmove',
    'touchend',
    'resize',                            
    'click',
    'mousemove',
    'close',
    'keypress'
];
//Creats an Observable for all events
const eventStreams = events.map((ev) => fromEvent(document, ev));
  //merge i.e. combine the emitted values
  const allEvents = merge(...eventStreams);

  //subscibtion that resets the timer Interval
  this.subscription = allEvents.subscribe((event) => {
  
  this.reset(); // resets the timer
});

//add another event to the observable to call logout function on window Close
this.subscription.add( fromEvent(window,'close').subscribe(e => { this.clearSubscribeLogout() }) );

}  

//Sets the interval check for every 1 min
  initInterval():void {  
   this.handle = setInterval(() => { 
      this.check(); 
    }, CHECK_INTERVAL);
  }

  //Method checks the duration of time where the user remained inactive
  check():void {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;//logintime + 5mins in seconds ex: 40 +5
    const diff = timeleft - now;//45 - 46min
    const isTimeout = diff < 0; //false

    //console.log(diff);

    // if (isTimeout )
    if (isTimeout && this.authGuard.isLoggedIn)  {     
      this.clearSubscribeLogout();
    }
  }

  //Method called on LogOut: Clears session, interval and navigate to Login
  clearSubscribeLogout():void  {
    if(this.authGuard.isLoggedIn) {

      this.authGuard.editLoginStatus('Login');

     /* autologout */
     this.subscription.unsubscribe();
     clearInterval(this.handle);
     sessionStorage.clear();
     sessionStorage.setItem('isLoggedIn', "false");
     sessionStorage.removeItem('token');
     this.router.navigate(['./login']);    
    }
  }

  //Method to set Login Status in the header Link
  setLoginStatus():void{
    if(this.authGuard.isLoggedIn) {
      this.authGuard.editLoginStatus("Logout");
    }
    else{
      this.authGuard.editLoginStatus("Login");
    }
  }
}