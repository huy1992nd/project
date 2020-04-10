import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {DataService} from './data.service';
import {UserModel, UserInfoModel} from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

  constructor(  private httpService: HttpService,
	private dataService: DataService
  ) { }

  async initApp(currentUser) {
    return new Promise(async (resolve, reject) => {
      if(currentUser.authToken && currentUser.id && currentUser.provider == "FACEBOOK"){
        await this.registerFace({user:currentUser});
      }
      this.dataService.currentUser.next(new UserModel(currentUser));
      resolve(true);
      });
  }
  register(data: any): Promise<any> {
	return this.httpService.publicPost('/user_register', data).toPromise();
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

  registerFace(data: any): Promise<any> {
	  return this.httpService.publicPost('/register_face', data).toPromise();
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
  listPost(data: any): Promise<any> {
    const url = data.post_type ? '/cms/post/index/?post_type=' + data.post_type : '/cms/post/index/';
    return this.httpService.authGet(url).toPromise();
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
listSong(data: any): Promise<any> {
  return this.httpService.publicGet('/list_song', data).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      // let list = this.dataService.listSong.getValue();
      let list = this.dataService.listSong.getValue() || {};
      list[data.page] = data.data;
      this.dataService.listSong.next(list);
    }
  })
}
//  Song detail
listSongDetail(data: any): Promise<any> {
  return this.httpService.publicGet('/song', data).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      let list = this.dataService.listSongDetail.getValue() || {};
      list[data.data.song_id] = data.data;
      this.dataService.listSongDetail.next(list);
    }
  })
}

listPageSong(data: any): Promise<any> {
  return this.httpService.publicGet('/list_page_song', data).toPromise().then((data:any)=>{
    if (data.data != undefined) {
      this.dataService.listPageSong.next(data.data);
    }
  })
}

}
