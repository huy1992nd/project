import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../../../../services/api.service';
import { DataService } from './../../../../services/data.service';
import { NotifyService } from 'src/app/services/notify.service';
@Component({
  selector: 'app-list-permission-by-role',
  templateUrl: './list-permission-by-role.component.html',
  styleUrls: ['./list-permission-by-role.component.css']
})
export class ListPermissionByRoleComponent implements OnInit {
  @Input() CurrentRole: any;
  roles: any = [];
  module: any = [];
  permissions: any = {};
  rolePermissions: any = [];
  listPermissionShow: any = [];
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    public notify: NotifyService
  ) { }

  ngOnInit() {
    this.getListRole();
    this.getListModule();
    this.getListPermission();
    let list = this.dataService.listRolePermission.getValue();
    if (list && list[this.CurrentRole.id]) {
      this.rolePermissions = list[this.CurrentRole.id];
    } else {
      this.getListRolePermission();
    }
    this.initSubscribe();
    let i = setInterval(()=>{
      if(Object.keys(this.permissions).length && Object.keys(this.module).length  ){
        clearInterval(i);
        this.factoryData();
      }
    },100)
  }

  initSubscribe() {
    this.dataService.listRole.subscribe(data => {
      if (!data)
        return;
      this.roles = this.dataService.listRole.getValue();
    });

    this.dataService.listModule.subscribe(data => {
      if (!data)
        return;
      this.module = this.dataService.listModule.getValue();
    });

    this.dataService.listPermission.subscribe(data => {
      if (!data)
        return;
      this.permissions = this.formatListPermission(this.dataService.listPermission.getValue());
      this.factoryData();
    });

    this.dataService.listRolePermission.subscribe(data => {
      if (data == null )
        return;
      if(!data[this.CurrentRole.id])
        return;
      this.rolePermissions = this.dataService.listRolePermission.getValue()[this.CurrentRole.id];
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
            status: this.rolePermissions.find(it => it.name == element.name) ? 1 : 0
          }
          module_insert.data.push(permission_insert);
        });
        listPermissionShow.push(module_insert);
      });
      this.listPermissionShow = listPermissionShow;
    }
    
  }

  getListRole() {
    let list = this.dataService.listRole.getValue();
    if (list) {
      this.roles = list;
    } else {
      this.apiService.listRole({}).then(data => {});
    }
  }

  getListModule() {
    let list = this.dataService.listModule.getValue();
    if (list) {
      this.module = list;
    } else {
      this.apiService.listModule({}).then(data => {});
    }
  }

  getListPermission() {
    let list = this.dataService.listPermission.getValue();
    if (list) {
      this.permissions = this.formatListPermission(list);
    } else {
      this.apiService.listPermission({}).then(data => {});
    }
  }

  formatListPermission(data){
    return data.reduce(function (h, obj) {
      h[obj.module] = (h[obj.module] || []).concat(obj);
      return h;
    }, {})
  }

  getListRolePermission() {
    let list = this.dataService.listRolePermission.getValue();
    this.apiService.listRolePermission({role_id:this.CurrentRole.id}).then(data => {
      if (data.data != undefined) {
        let permissionListArr = data.data;
        if(list){
          list[this.CurrentRole.id] = permissionListArr;
        }else{
          list = {};
          list[this.CurrentRole.id] = permissionListArr;
        }
        this.dataService.listRolePermission.next(list);
      }
    });
  }

  updateRole(){
    //update permission for user
    let list_permission = [];
    this.listPermissionShow.forEach(module=>{
      module.data.forEach(permission=>{
        if(permission.status){
          list_permission.push(permission.id);
        }
      })
    });
    this.apiService.updateRolePermission({
      role_id:this.CurrentRole.id,
      list_permission:list_permission
    }).then(result => {
      if (result.result_code == 0) {
        this.getListRolePermission();
        this.notify.success('Cập nhật thành công !!!');
      }
    }).catch(error => {
    })
  }
}
