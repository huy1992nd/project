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
        var token_face = localStorage.getItem('session_face');
        if(!token_face){
          resolve(false);
        }else{
          this.userApiService.registerFace({ authToken: token_face }).then(data => {
            if (data.result_code == 0) {
              this.userDataService.currentUser.next(new UserModel(data.user));
              resolve(true);
            }else{
              localStorage.removeItem("session_face");
              reject(false);
            }
          }).catch(error => {
             localStorage.removeItem("session_face");
              reject(false);
          }).finally(() => {
              // reject(false);
          })
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

  
 
}
