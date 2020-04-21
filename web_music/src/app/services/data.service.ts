import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as global from '../common/define';
import { UserModel, UserInfoModel } from '../models/user.model';
import {TranslateService} from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  currentUser: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(new UserModel({}));
  currentUserInfo: BehaviorSubject<UserInfoModel> = new BehaviorSubject<UserInfoModel>(new UserInfoModel({}));
  currentLanguage:  BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userPermission:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listUser:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listCustomer:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listRole:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listModule:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listPermission:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listUserPermission:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listRolePermission:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listBank:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listBankAccount:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listRateSite:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listCurrencies:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listFee:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listSong:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listSongDetail:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listPageSong:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentSearchSong:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentPageSong:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listLike:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listFavorites:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentMode:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  topLike:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  topView:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  inforRegister:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listPost:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listHistory:   BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private translateService: TranslateService) {
    var lang = localStorage.getItem('language') || navigator.language;
    translateService.addLangs(['en', 'vi']);
    if(!lang || (lang !='vi'&&lang!='en')){
      lang ='vi';
    }
    this.UpdateLanguage(lang);
   }
   
   UpdateLanguage(lang){
    localStorage.setItem('language',lang);
    this.currentLanguage.next(lang);
    this.translateService.use(lang);
}
}
