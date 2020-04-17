import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../services/data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';
@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.css']
})
export class UpdateUserDialogComponent implements OnInit {

  updateUser: FormGroup;
  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    public translate: TranslateService,
    private userApiService: ApiService,
    public notify: NotifyService,
    @Inject(MAT_DIALOG_DATA) public user: any
    ) { }
    account_validation_messages = {
      'user_name': [
        { type: 'required', message: 'Username không được để trống' },
        { type: 'minlength', message: 'Username không được dưới 3 kí tự' }
      ],
      'email': [
        { type: 'required', message: 'Email không được để trống' },
        { type: 'email', message: 'Email không đúng' }
      ],
      'phone_number': [
        { type: 'pattern', message: 'Số phone không đúng' }
      ]
      };
  
    ngOnInit() {
      this.updateUser = new FormGroup({
          user_name: new FormControl(this.user.user_name, [Validators.required]),
          mail: new FormControl(this.user.mail, [Validators.required, Validators.email]),
          account_id: new FormControl(this.user.account_id, []),
          address: new FormControl(this.user.address, []),
          phone_number: new FormControl(this.user.phone_number,[]),
          site: new FormControl(window.location.hostname),
        }, {  });
    }
  
    onNoClick(needUpdate: boolean): void {
      this.dialogRef.close(needUpdate);
    }
  
    submit() {
      if (this.updateUser.valid) {
        let data = this.updateUser.value;
        this.userApiService.userUpdate(data).then(result => {
          if (result.result_code == 0) {
            this.notify.success('Cập nhật khoản thành công');
            this.userApiService.listUser({}).then(data => {
              if (data.data != undefined) {
                let userListArr = data.data.sort((a, b) => +new Date(b.create_date) - +new Date(a.create_date));
                this.dataService.listUser.next(userListArr);
              }
            });
            this.dialogRef.close(this.updateUser.getRawValue());
          } else {
            this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
          }
        }).catch(error => {
        })
       
      }
    }
}
