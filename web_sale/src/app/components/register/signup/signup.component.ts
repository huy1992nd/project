import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

import { Router } from '@angular/router';
import { confirmPasswordValidator } from 'src/app/common/ultilities';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public confirmPasswordValidator: boolean = false;
  public  isRootDomain: boolean;
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
      { type: 'minlength', message: 'Số phone không được dưới 10 kí tự' },
      { type: 'pattern', message: 'Số phone không đúng' }
    ],
    'agree': [
      {type:'pattern', message:'phái nhấn agree'}
    ]
    };
    public isLoading : boolean = false;
  constructor(
    public translate: TranslateService,
    private userApiService: ApiService,
    private router: Router,
    public notify: NotifyService
  ) { }

  ngOnInit() {
    console.log(" host",window.location.hostname);
   // this.isRootDomain = (window.location.hostname == 'sharectv.com' || window.location.hostname == 'localhost');
    this.form = new FormGroup({
      user_name: new FormControl('', []),
      gender: new FormControl('male', [Validators.required]),
      agree: new FormControl(false, [Validators.pattern('true')]),
      account_id: new FormControl('', [Validators.required,Validators.minLength(6),Validators.pattern("[^' ']+")]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', [Validators.required,Validators.minLength(6)]),
      phone_number: new FormControl('',[]),
      current_domain: new FormControl(window.location.hostname),
    }, { validators: [confirmPasswordValidator] });
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      let data = this.form.value;
      data["host"]  =  window.location.hostname;
      this.userApiService.register(data).then(result => {
        this.isLoading = false;
        if (result.result_code == 0) {
          this.notify.success('Đăng ký thành công');

          let data = {
            account_id: this.form.get('account_id').value,
            password: this.form.get('password').value,
            keyVerify: result.keyVerify
          }
          this.router.navigate(['register-verify']);
          // this.router.navigateByUrl('/xac-nhan-tai-khoan-moi', { state: { data: 'test test' } });
        } else {
          this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
         // this.notify.error("Đăng ký không thành công, xin vui lòng kiểm tra lại");
        }
      }).catch(error => {
        this.isLoading = false;
      })
    }else {
      // if(this.form.errors && this.form.errors.confirmPassword)
      //        this.notify.error("Giá trị xác nhận mật khẩu nhập chưa đúng");
      // else {
      //   this.notify.error("Giá trị nhập chưa đúng");
      // }
    }
  }

}
