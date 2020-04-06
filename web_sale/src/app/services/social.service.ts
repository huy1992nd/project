import { Injectable, NgZone } from '@angular/core';
// import { BehaviorSubject } from "rxjs/Rx";
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var FB: any;
@Injectable({
  providedIn: 'root'
})
export class SocialService {
  // public ready = new BehaviorSubject<boolean>(false);
  // public endpointBase = 'http://graph.facebook.com';
  constructor() { 
  }

  initFaceBook(){
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '698817537590545',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  loginFaceBook(calback){
    FB.login((response)=>
    {
      return calback(response);
    });
  }

  checkStatusFaceBook(calback){
    FB.getLoginStatus(function(response) {
      return calback(response);
    });
  }

  public loadSdk() {
    // this.initFaceBook();
    this.loadAsync(() => { });
}

public loadAsync(callback: () => void) {
  (window as any).fbAsyncInit = function() {
    FB.init({
      appId      : '698817537590545',
      cookie     : true,
      xfbml      : true,
      version    : 'v3.1'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}

public getLoginStatus() {
    FB.getLoginStatus((response: any) => { console.log(response); });
}

public getProfile() {
    return new Promise((resolve, reject) => {
        let fields = [
            "id", "name", "email", "cover", "birthday"
        ];
        FB.api(`/me?fields=${fields.toString()}`, (response: any) => {
            resolve(response);
        });
    });
}
}
