import { Injectable,Inject } from '@angular/core';

import * as global from '../common/define';
import { DataService } from './data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  domain: any = "";
  public serverUrl: string = global.server;
  constructor(
    private http: HttpClient,
    private userDataService: DataService
  ) {
    this.domain = window.location.hostname;
   }

  public authPost(path: string, data: any = null) {
    let httpOptions ;
    let user = this.userDataService.currentUser.getValue();
    let token = "";
    if(user) {
        token = this.userDataService.currentUser.getValue().session || '';
    }

     httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token,
        domain:this.domain
      })
    }
    return this.http.post(this.serverUrl + path, data, httpOptions)
  };

  public publicPost(path: string, data: any = null) {
    let  httpOptions = {
      headers:  new HttpHeaders({
          domain:this.domain 
      })
    }
    return this.http.post(this.serverUrl + path, data,httpOptions)
  };

  public authGet(path: string, params: {} = {}) {
    let user = this.userDataService.currentUser.getValue();
    let token = user.session || '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token,
        domain:this.domain 
      }),
      params: params
    }

    return this.http.get(this.serverUrl + path, httpOptions)
  }

  public publicGet(path: string, params: {} = {}) {
    const httpOptions = {
      headers: new HttpHeaders({
        domain:this.domain 
      }),
      params: params
    }

    return this.http.get(this.serverUrl + path, httpOptions)
  }
}
