import { Injectable } from '@angular/core';
import { CanActivate, Router,RouterStateSnapshot ,ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {ApiService} from '../services/api.service';
import {SocialService} from '../services/social.service';
import {DataService} from '../services/data.service';
import {UserModel, UserInfoModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(  private router: Router,
    private userApiService: ApiService,
    private socialService: SocialService,
    private userDataService: DataService){
  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuthGuardPromise().then(data=>{
         if(data){
           return true;
         }else {
          this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
          return false;
         }
    }).catch(e=>{
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
        return false;
    })
}

checkAuthGuardPromise(){
  return new Promise(async (resolve,reject)=>{
      let currentUser = this.userDataService.currentUser.getValue();
      var token = localStorage.getItem('session');
     
      if (!token) {
      let login_social = await this.checkLoginSocial();
        if(login_social){
          resolve(true);
        }else{
          resolve(false);
        }
      }else {
          if (currentUser.account_id == '') {
              this.userApiService.login({ token: token }).then(data => {
                  if (data.result_code == 0) {
                      this.userApiService.initApp(data)
                          .then(() => {
                              resolve(true);
                          });
                  }else{
                    localStorage.removeItem("session");
                    reject(false);
                  }
              }).catch(error => {
                 localStorage.removeItem("session");
                 reject(false);
              }).finally(() => {
                  // reject(false);
              })
          } else {
             resolve(true);
      }
      }
  })
}

checkLoginSocial(){
  return new Promise((resolve, reject)=>{
    var token_face = localStorage.getItem('session_facebook');
    if(!token_face){
      var token_google = localStorage.getItem('session_google');
      if(!token_google){
        resolve(false);
      }else{
        this.userApiService.loginSocial({ authToken: token_google, login_type : "google" }).then(data => {
          if (data.result_code == 0) {
            this.userDataService.currentUser.next(new UserModel(data));
            resolve(true);
          }else{
            localStorage.removeItem("session_google");
            reject(false);
          }
        }).catch(error => {
           localStorage.removeItem("session_google");
           reject(false);
        }).finally(() => {
        })
      }

    }else{
      this.userApiService.loginSocial({ authToken: token_face, login_type:"facebook" }).then(data => {
        if (data.result_code == 0) {
          this.userDataService.currentUser.next(new UserModel(data));
          resolve(true);
        }else{
          localStorage.removeItem("session_facebook");
          reject(false);
        }
      }).catch(error => {
         localStorage.removeItem("session_facebook");
         reject(false);
      }).finally(() => {
      })
    }
  })
}

}
