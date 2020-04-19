import {Injectable, NgZone} from '@angular/core';
import {HttpService} from './http.service';
import {DataService} from './data.service';
import {UserModel, UserInfoModel} from '../models/user.model';
import {FACEBOOK_CLIENT_ID, GOOGLE_CLIENT_ID} from '../common/define';
declare const FB:any;
declare const gapi:any;

@Injectable({
    providedIn: 'root'
})
export class ApiService {

  auth2: any;

  constructor(  private httpService: HttpService,
  private dataService: DataService,
  private zone: NgZone
  ) {
    FB.init({
      appId      : FACEBOOK_CLIENT_ID,
      status     : false, // the SDK will attempt to get info about the current user immediately after init
      cookie     : false,  // enable cookies to allow the server to access
      xfbml      : false,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML
      version    : 'v2.8' // use graph api version 2.5
    });

    gapi.load('auth2', () => {
      gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            fetch_basic_profile: true
        }).then((auth) => {
            this.zone.run(() => {
                this.auth2 = auth;
            });
        },
        );
      });

   }

  async initApp(currentUser) {
    return new Promise(async (resolve, reject) => {
      this.dataService.currentUser.next(new UserModel(currentUser));
      resolve(true);
      });
  }
  register(data: any): Promise<any> {
	  return this.httpService.publicPost('/user_register', data).toPromise();
  }

  userVerify(data: any): Promise<any> {
	  return this.httpService.publicPost('/user_verify', data).toPromise();
  }

  resendsVerify(data: any): Promise<any> {
	  return this.httpService.publicPost('/resend_verify', data).toPromise();
  }

  getRole(): Promise<any> {
    return this.httpService.authPost('/list_roles').toPromise();
  }

  createRole(data:any): Promise<any>{
    return this.httpService.authPost('/create_roles', data).toPromise();
  }

  updateRole(data:any): Promise<any>{
    return this.httpService.authPost('/update_roles', data).toPromise();
  }

  deleteRole(data:any): Promise<any>{
    return this.httpService.authPost('/remove_roles',data).toPromise();
  }

  userCreateNew(data: any): Promise<any> {
	return this.httpService.authPost('/user_create_new', data).toPromise();
  }

  userUpdate(data: any): Promise<any> {
	return this.httpService.authPost('/user_update_profile', data).toPromise();
  }

  getUserProfile(data: any): Promise<any> {
	  return this.httpService.authGet('/user_get_profile', data).toPromise();
  }

  updateUserPermission(data: any): Promise<any> {
    return this.httpService.authPost('/update_user_permission', data).toPromise();
  }

  updateRolePermission(data: any): Promise<any> {
    return this.httpService.authPost('/update_roles_permission', data).toPromise();
  }

  userActive(data: any): Promise<any> {
	return this.httpService.authPost('/user_active', data).toPromise();
  }
  
  listRolePermission(data:any): Promise<any> {
    return this.httpService.authPost('/permission_by_role',data).toPromise();
  }

  createPermission(data:any): Promise<any>{
    return this.httpService.authPost('/add_permission', data).toPromise();
  }

  updatePermission(data:any): Promise<any>{
    return this.httpService.authPost('/update_permissions', data).toPromise();
  }

  deletePermission(data:any): Promise<any>{
    return this.httpService.authPost('/remove_permissions', data).toPromise();
  }

  login(data: any): Promise<any> {
	return this.httpService.publicPost('/user_login', data).toPromise();
  }

  googleLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth2.signIn().then(user => {
        console.log('user google', user);
        this.registerGoogle({
          access_token: user.tc.access_token,
        }).then(data=>{
          if(data.result_code == 0){
            data.user.login_type = "google";
            resolve({
                  token:data.token,
                  user:data.user
                }
              );
          }else{
            reject(false);
          }
        });
      });
    });
  }

  registerGoogle(data: any): Promise<any> {
	  return this.httpService.publicPost('/register_google', data).toPromise();
  }

  fbLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.login(result => {
        if (result.authResponse) {
          this.registerFace({access_token: result.authResponse.accessToken}).then(data=>{
            if(data.result_code == 0){
              data.user.login_type = "face_book";
              resolve({
                    token:data.token,
                    user:data.user
                  }
                );
            }else{
              reject(false);
            }
          });
        }
      }, {scope: 'public_profile,email'})
    });
  }

  registerFace(data: any): Promise<any> {
	  return this.httpService.publicPost('/register_face', data).toPromise();
  }

  loginSocial(data: any): Promise<any> {
	  return this.httpService.publicPost('/login_social', data).toPromise();
  }

  listUser(data: any): Promise<any> {
	return this.httpService.authPost('/user_list', data).toPromise();
  }

  listRole(data: any): Promise<any> {
    return this.httpService.authPost('/list_roles', data).toPromise()
    .then((data:any)=>{
      if (data.data != undefined) {
        var roleListArr = data.data;
        this.dataService.listRole.next(roleListArr);
      }
    });
  }

  listModule(data: any): Promise<any> {
    return this.httpService.authPost('/list_module', data).toPromise()
    .then((data:any)=>{
      if (data.data != undefined) {
        this.dataService.listModule.next(data.data);
      }
    });
  }

  listPermission(data: any): Promise<any> {
    return this.httpService.authPost('/list_permissions', data).toPromise()
    .then((data:any)=>{
      if (data.data != undefined) {
        this.dataService.listPermission.next(data.data);
      }
    });
  }

  listUserPermission(data: any): Promise<any> {
    return this.httpService.authPost('/permission_by_account', data).toPromise();
  }
  
  listBank(data: any): Promise<any> {
    return this.httpService.authPost('/list_bank', data).toPromise().then((data:any)=>{
      if (data.data != undefined) {
        var listArr = data.data;
        this.dataService.listBank.next(listArr);
      }
    })
  }


  addBank(data: any): Promise<any> {
    return this.httpService.authPost('/add_bank', data).toPromise();
  }

  updateBank(data: any): Promise<any> {
    return this.httpService.authPost('/update_bank', data).toPromise();
  }

  deleteBank(data: any): Promise<any> {
    return this.httpService.authPost('/delete_bank', data).toPromise();
  }

  listBankSuggest(data: any): Promise<any> {
    return this.httpService.authPost('/list_bank_suggest', data).toPromise();
  }

  listBankAccount(data: any): Promise<any> {
    return this.httpService.authPost('/list_bank_account', data).toPromise().then((data:any)=>{
      if (data.data != undefined) {
        let listArr = data.data.sort((a, b) => +new Date(b.create_date) - +new Date(a.create_date));
        this.dataService.listBankAccount.next(listArr);
      }
    });
  }

  addBankAccount(data: any): Promise<any> {
    return this.httpService.authPost('/add_bank_account', data).toPromise();
  }

  updateBankAccount(data: any): Promise<any> {
    return this.httpService.authPost('/update_bank_account', data).toPromise();
  }
  
  deleteBankAccount(data: any): Promise<any> {
    return this.httpService.authPost('/delete_bank_account', data).toPromise();
  }

  listRateSite(data: any): Promise<any> {
    return this.httpService.authPost('/list_rate', data).toPromise().then((data:any)=>{
      if (data.data != undefined) {
        this.dataService.listRateSite.next(data.data);
      }
    });
  }

  addRateSite(data: any): Promise<any> {
    return this.httpService.authPost('/add_rate', data).toPromise();
  }

  updateRateSite(data: any): Promise<any> {
    return this.httpService.authPost('/update_rate', data).toPromise();
  }
  
  deleteRateSite(data: any): Promise<any> {
    return this.httpService.authPost('/delete_rate', data).toPromise();
  }

  listCurrencies(data: any): Promise<any> {
    return this.httpService.authPost('/list_currencies', data).toPromise().then((data:any)=>{
      if (data.data != undefined) {
        let listArr = data.data.sort((a, b) => +new Date(b.create_date) - +new Date(a.create_date));
        this.dataService.listCurrencies.next(listArr);
      }
    });
  }

  listFee(data: any): Promise<any> {
    return this.httpService.authPost('/list_fee', data).toPromise().then((data:any)=>{
      if (data.data != undefined) {
        this.dataService.listFee.next(data.data);
      }
    });
  }

  updateFee(data: any): Promise<any> {
    return this.httpService.authPost('/update_fee', data).toPromise();
  }

  // Page & Post
  listPost(input: any): Promise<any> {
    const url = input.post_type ? '/cms/post/index/?post_type=' + input.post_type : '/cms/post/index/';
    // return this.httpService.publicGet(url).toPromise();
    return this.httpService.publicGet(url, input).toPromise().then((data:any)=>{
      if (data.data != undefined) {
        this.dataService.listPost.next(data.data);
      }
    })
}

createPost(data: any): Promise<any> {
    return this.httpService.authPost('/cms/post/create', data).toPromise();
}

getEditPost(data: any): Promise<any> {
    const url = '/cms/post/edit/' + data.id;
    return this.httpService.authGet(url).toPromise();
}

postEditPost(data: any): Promise<any> {
    const url = '/cms/post/edit/' + data.id;
    return this.httpService.authPost(url, data).toPromise();
}

getDeletePost(data: any): Promise<any> {
    const url = '/cms/post/delete/' + data.id;
    return this.httpService.authGet(url).toPromise();
}

// Taxonomy
getListTaxonomy(data: any): Promise<any> {
    return this.httpService.authGet('/cms/taxonomy/index').toPromise();
}

postCreateTaxonomy(data: any): Promise<any> {
    return this.httpService.authPost('/cms/taxonomy/create', data).toPromise();
}

getEditTaxonomy(data: any): Promise<any> {
    const url = '/cms/taxonomy/edit/' + data.id;
    return this.httpService.authGet(url).toPromise();
}

postEditTaxonomy(data: any): Promise<any> {
    const url = '/cms/taxonomy/edit/' + data.id;
    return this.httpService.authPost(url, data).toPromise();
}

getDeleteTaxonomy(data: any): Promise<any> {
    const url = '/cms/taxonomy/delete/' + data.id;
    return this.httpService.authGet(url).toPromise();
}

//  Menu
getListMenu(data: any): Promise<any> {
    return this.httpService.authGet('/cms/menu/index').toPromise();
}

//  Menu Node
getListMenuNode(data: any): Promise<any> {
    const url = '/cms/menunode/index/?menu_id=' + data.menu_id;
    return this.httpService.authGet(url).toPromise();
}

postCreateMenuNode(data: any): Promise<any> {
    return this.httpService.authPost('/cms/menunode/create', data).toPromise();
}

//  Song
listSong(input: any): Promise<any> {
  return this.httpService.authGet('/list_song', input).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      let list = this.dataService.listSong.getValue() || {};
      if(!list[input.search]){
        list[input.search] = {};
      }
      list[input.search][input.page] = data.data;
      this.dataService.listSong.next(list);
    }
  })
}

//  Song detail
listSongDetail(input: any): Promise<any> {
  return this.httpService.authGet('/song', input).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      let list = this.dataService.listSongDetail.getValue() || {};
      list[data.data.song_id] = data.data;
      this.dataService.listSongDetail.next(list);
    }
  })
}

listPageSong(input: any): Promise<any> {
  return this.httpService.authGet('/list_page_song', input).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      let list = this.dataService.listPageSong.getValue() || {};
      list[input.search] = data.data;
      this.dataService.listPageSong.next(list);
    }
  })
}

listLike(input: any): Promise<any> {
  return this.httpService.authGet('/list_like', input).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      let list = this.dataService.listLike.getValue() || {};
      list[input.account_id] = data.data;
      this.dataService.listLike.next(list);
    }
  })
}

listFavorites(input: any): Promise<any> {
  return this.httpService.authGet('/list_favorites', input).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      let list = this.dataService.listFavorites.getValue() || {};
      list[input.account_id] = data.data;
      this.dataService.listFavorites.next(list);
    }
  })
}

topLike(input: any): Promise<any> {
  return this.httpService.authGet('/top_like', input).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      let list = this.dataService.topLike.getValue() || {};
      list = data.data;
      this.dataService.topLike.next(list);
    }
  })
}

topView(input: any): Promise<any> {
  return this.httpService.authGet('/top_view', input).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      this.dataService.topView.next(data.data);
    }
  })
}

updateLike(input: any): Promise<any> {
  return this.httpService.authPost('/update_like', input).toPromise().then((data:any)=>{})
}

updateView(input: any): Promise<any> {
  return this.httpService.authPost('/update_view', input).toPromise().then((data:any)=>{})
}

}
