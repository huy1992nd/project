import { Injectable } from '@angular/core';
import { CanActivate, Router,RouterStateSnapshot ,ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {ApiService} from '../services/api.service'
import {DataService} from '../services/data.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(  private router: Router,
    private userApiService: ApiService,
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
    console.log("vo day",this.router);
      
      let currentUser = this.userDataService.currentUser.getValue();
      var token = localStorage.getItem('session');
      if (!token) {
        //  this.userDataService.isAuthenticated = false;
        resolve(false);
      }else {
          if (currentUser.account_id == '') {
              this.userApiService.login({ token: token }).then(data => {
                  if (data.result_code == 0) {
                    //  this.userDataService.isAuthenticated = true;
                      this.userApiService.initApp(data)
                          .then(() => {
                              resolve(true);
                          });
                  }
              }).catch(error => {
                 // this.userDataService.isAuthenticated = false;
                 localStorage.removeItem("session");
                  reject(false);
              }).finally(() => {
                  reject(false);
              })
          } else {
             resolve(true);
      }
  }
  })
}

  
 
}
