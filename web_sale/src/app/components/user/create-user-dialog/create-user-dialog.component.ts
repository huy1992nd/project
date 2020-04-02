import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../services/data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/common/ultilities';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';
@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css']
})
export class CreateUserDialogComponent implements OnInit {
  isLoading: Boolean = false;
  showPassword: Boolean = false;
  showConfirmPassword: Boolean = false;
  confirmPasswordValidator: Boolean = false;
  createUser: FormGroup;
  constructor(
    public translate: TranslateService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private userApiService: ApiService,
    public notify: NotifyService
    ) { }
    account_validation_messages = {
      'user_name': [
        { type: 'required', message: 'Username không được để trống' },
        { type: 'minlength', message: 'Username không được dưới 3 kí tự' }
      ],
      'account_id': [
        { type: 'required', message: 'Account_id không được để trống' },
        { type: 'minlength', message: 'Account id không được dưới 6 kí tự' },
        {type:'pattern', message:'Account id không được có dấu cách'}
      ],
      'email': [
        { type: 'required', message: 'Email không được để trống' },
        { type: 'email', message: 'Email không đúng' }
      ],
      'confirm_password': [
        { type: 'required', message: 'Confirm password không được để trống' },
        { type: 'confirmPassword', message: 'Confirm password không giống password' }
      ],
      'password': [
        { type: 'required', message: 'Password không được để trống' },
        { type: 'minlength', message: 'Password không được dưới 6 kí tự' }
      ],
      'phone_number': [
        { type: 'pattern', message: 'Số phone không đúng' }
      ]
      };
  
    ngOnInit() {
      this.createUser = new FormGroup({
          user_name: new FormControl('', [Validators.required]),
          account_id: new FormControl('', [Validators.required,Validators.minLength(6),Validators.pattern("[^' ']+")]),
          mail: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required, Validators.minLength(6)]),
          confirm_password: new FormControl('', [Validators.required,Validators.minLength(6)]),
          address: new FormControl('', [ ]),
          phone_number: new FormControl('',[Validators.required, Validators.minLength(6)]),
          current_domain: new FormControl(window.location.hostname),
        }, { validators: [confirmPasswordValidator] });
    }
  
    onNoClick(needUpdate: boolean): void {
      this.dialogRef.close(needUpdate);
    }
  
    submit() {
      if (this.createUser.valid) {
        let data = this.createUser.value;
        this.userApiService.userCreateNew(data).then(result => {
          if (result.result_code == 0) {
            this.notify.success('Tạo tài khoản thành công');
            this.userApiService.listUser({}).then(data => {
              if (data.data != undefined) {
                let userListArr = data.data.sort((a, b) => +new Date(b.create_date) - +new Date(a.create_date));
                this.dataService.listUser.next(userListArr);
              }
            });
            this.dialogRef.close(this.createUser.getRawValue());
          } else {
            this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
          }
        }).catch(error => {
        })
       
      }
    }
}
