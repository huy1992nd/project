import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../../../services/data.service';
@Component({
  selector: 'app-register-verify',
  templateUrl: './register-verify.component.html',
  styleUrls: ['./register-verify.component.css']
})
export class RegisterVerifyComponent implements OnInit {

  form: FormGroup;
  newUser: any;
  infor_register: any;
  isLoading: Boolean = false;
  
  constructor(
    public translate: TranslateService,
    private userApiService: ApiService,
    public notify: NotifyService,
    private router: Router,
    public dataservice: DataService
  ) { }

  ngOnInit() {
    if(!this.dataservice.inforRegister.getValue()){
      this.router.navigate(['/register']);
    }else{
      this.infor_register = this.dataservice.inforRegister.getValue();
      this.form = new FormGroup({
        account_id: new FormControl(this.infor_register.account_id ||'', [Validators.required]),
        email: new FormControl(this.infor_register.email||'', [Validators.required]),
        verify_code: new FormControl('', [Validators.required]),
        type: new FormControl('register', [Validators.required])
      });

    }
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      let data = this.form.value;
      data["host"]  =  window.location.hostname;
      this.userApiService.userVerify(data).then(result => {
        this.isLoading = false;
        if (result.result_code == 0) {
          this.notify.success('Xác thực thành công');
          this.router.navigate(['login']);
        } else {
          this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
        }
      }).catch(error => {
        this.isLoading = false;
      })
    }
  }

  resendVerifyCode() {
    let data = this.form.value;
    this.isLoading = true;
    this.userApiService.resendsVerify(data).then(result => {
      this.isLoading = false;
      if (result.result_code == 0) {
        this.notify.success('Bạn hãy kiểm tra lại mã trong email của mình');
      } else {
        this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
      }
    }).catch(error => {
      this.isLoading = false;
    })
  }
}
