import { Injectable } from '@angular/core';
import { CanActivate, Router,RouterStateSnapshot ,ActivatedRouteSnapshot } from '@angular/router';
import {DataService} from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthPostGuard implements CanActivate {
  constructor(  private router: Router,
    private userDataService: DataService){
  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAuthGuardPromise().then(data=>{
         if(data){
           return true;
         }else {
          this.router.navigate(['./notification']);
          return false;
         }
    }).catch(e=>{
        return false;
    })
}

checkAuthGuardPromise(){
  return new Promise(async (resolve,reject)=>{
      let currentUser = this.userDataService.currentUser.getValue();
      if(currentUser && currentUser.permission == 9){
        resolve(true);
      }else{
        resolve(false);
      }
  })
}

}
