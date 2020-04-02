import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../../../../services/api.service';
import { DataService } from './../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify.service';
@Component({
  selector: 'app-user-show-infor',
  templateUrl: './user-show-infor.component.html',
  styleUrls: ['./user-show-infor.component.css']
})
export class UserShowInforComponent implements OnInit {
  @Input() User: any;
  current_user: any;
  roles: any = [];
  formProfile: FormGroup;
  account_validation_messages = {
    'user_name': [
      { type: 'required', message: 'Username không được để trống' },
      { type: 'minlength', message: 'Username không được dưới 3 kí tự' }
    ],
    'mail': [
      { type: 'required', message: 'Email không được để trống' },
      { type: 'email', message: 'Email không đúng' }
    ],
    'phone_number': [
      { type: 'minlength', message: 'Số phone không được dưới 10 kí tự' },
      { type: 'pattern', message: 'Số phone không đúng' }
    ]
    };
  constructor(
    private userApiService: ApiService,
    private userDataService: DataService,
    public notify: NotifyService
  ) { }

  ngOnInit() {
    this.getListRole();
    this.initSubscribe();
    this.formProfile = new FormGroup({
      user_name: new FormControl(this.User.user_name,[Validators.required]),
      account_id: new FormControl(this.User.account_id),
      mail: new FormControl( this.User.mail,[Validators.required, Validators.email]),
      phone_number: new FormControl(this.User.phone_number,[Validators.required]),
      site: new FormControl(this.User.site),
      address: new FormControl( this.User.address),
      permission: new FormControl( this.User.permission),
      roles: new FormControl( this.User.roles)
    });
    this.current_user = this.userDataService.currentUser.getValue();
    if(this.current_user.permission != 9){
      this.formProfile.get("permission").disable();
    }
  }

  initSubscribe() {
    this.userDataService.listRole.subscribe(data => {
      if (!data)
        return;
      this.roles = this.userDataService.listRole.getValue();
    });

  }

  getListRole() {
    let list = this.userDataService.listRole.getValue();
    if (list) {
      this.roles = list;
    } else {
      this.userApiService.listRole({}).then(data => {});
    }
  }

  submit() {
    if (this.formProfile.valid) {
      this.userApiService.userUpdate(this.formProfile.value).then(result => {
        if (result.result_code == 0) {
          this.notify.success('Cập nhật thành công');
          this.userApiService.listUser({}).then(data => {
            if (data.data != undefined) {
              let userListArr = data.data.sort((a, b) => +new Date(b.create_date) - +new Date(a.create_date));
              this.userDataService.listUser.next(userListArr);
            }
          });
        }
      }).catch(error => {
      })
    }
  }

}
