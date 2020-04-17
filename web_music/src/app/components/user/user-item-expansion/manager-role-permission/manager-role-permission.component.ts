import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../../../../services/api.service';
import { DataService } from './../../../../services/data.service';
import { NotifyService } from 'src/app/services/notify.service';
export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-manager-role-permission',
  templateUrl: './manager-role-permission.component.html',
  styleUrls: ['./manager-role-permission.component.css']
})
export class ManagerRolePermissionComponent implements OnInit {
  @Input() User: any;
  roles: any = [];
  module: any = [];
  permissions: any = {};
  userPermissions: any = [];
  listPermissionShow: any = [];
  constructor(
    private userApiService: ApiService,
    private userDataService: DataService,
    public notify: NotifyService
  ) { }

  ngOnInit() {
    let i = setInterval(()=>{
      if(Object.keys(this.permissions).length && Object.keys(this.module).length  ){
        clearInterval(i);
        this.factoryData();
      }
    },100)
    this.getListRole();
    this.getListModule();
    this.getListPermission();
    let list = this.userDataService.listUserPermission.getValue();
    if (list && list[this.User.account_id]) {
      this.userPermissions = list[this.User.account_id];
    } else {
      this.getListUserPermission();
    }
    this.initSubscribe();

  }

  initSubscribe() {
    this.userDataService.listRole.subscribe(data => {
      if (!data)
        return;
      this.roles = this.userDataService.listRole.getValue();
    });
    this.userDataService.listModule.subscribe(data => {
      if (!data)
        return;
      this.module = this.userDataService.listModule.getValue();
      this.factoryData();
    });
    this.userDataService.listPermission.subscribe(data => {
      if (!data)
        return;
      this.permissions = this.formatListPermission(this.userDataService.listPermission.getValue());
      this.factoryData();
    });

    this.userDataService.listUserPermission.subscribe(data => {
      if (data == null )
        return;
      if(!data[this.User.account_id])
        return;
      this.userPermissions = this.userDataService.listUserPermission.getValue()[this.User.account_id];
      this.factoryData();
    });

  }

  factoryData() {
    if(Object.keys(this.permissions).length && Object.keys(this.module).length  ){
      let listPermissionShow = [];
      Object.keys(this.permissions).forEach((module_name)=>{
        let module_obj = this.module.find(item=> item.name == module_name);
        let module_display_name = module_obj ? module_obj.display_name : "";
        let module_insert = {
          name:module_display_name,
          data:[]
        };  
        this.permissions[module_name].forEach( element => {
          let permission_insert = {
            id:element.id,
            display_name: element.display_name,
            status: this.userPermissions.find(it => it.name == element.name) ? 1 : 0
          }
          module_insert.data.push(permission_insert);
        });
  
        listPermissionShow.push(module_insert);
      });
      this.listPermissionShow = listPermissionShow;
    }
  }

  getListRole() {
    let list = this.userDataService.listRole.getValue();
    if (list) {
      this.roles = list;
    } else {
      this.userApiService.listRole({}).then(data => {});
    }
  }

  getListModule() {
    let list = this.userDataService.listModule.getValue();
    if (list) {
      this.module = list;
    } else {
      this.userApiService.listModule({}).then(data => {});
    }
  }

  getListPermission() {
    let list = this.userDataService.listPermission.getValue();
    if (list) {
      this.permissions = this.formatListPermission(list);
    } else {
      this.userApiService.listPermission({}).then(data => {});
    }
  }

  formatListPermission(data){
    return data.reduce(function (h, obj) {
      h[obj.module] = (h[obj.module] || []).concat(obj);
      return h;
    }, {})
  }

  getListUserPermission() {
    let list = this.userDataService.listUserPermission.getValue();
    this.userApiService.listUserPermission({account_id:this.User.account_id}).then(data => {
      if (data.data != undefined) {
        let permissionListArr = data.data;
        if(list){
          list[this.User.account_id] = permissionListArr;
        }else{
          list = {};
          list[this.User.account_id] = permissionListArr;
        }
        this.userDataService.listUserPermission.next(list);
      }
    });
  }

  updateRole(){
    //update user
    this.userApiService.userUpdate(this.User).then(result => {
      if (result.result_code == 0) {
        this.notify.success('Cập nhật thành công !!!');
        this.userApiService.listUser({}).then(data => {
          if (data.data != undefined) {
            let userListArr = data.data.sort((a, b) => +new Date(b.create_date) - +new Date(a.create_date));
            this.userDataService.listUser.next(userListArr);
          }
        });
      }
    }).catch(error => {
    })
    //update permission for user
    let list_permission = [];
    this.listPermissionShow.forEach(module=>{
      module.data.forEach(permission=>{
        if(permission.status){
          list_permission.push(permission.id);
        }
      })
    });
    this.userApiService.updateUserPermission({
      account_id:this.User.account_id,
      list_permission:list_permission
    }).then(result => {
      if (result.result_code == 0) {
        this.getListUserPermission();
      }
    }).catch(error => {
    })
  }


}
