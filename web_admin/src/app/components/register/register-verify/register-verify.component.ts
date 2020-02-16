import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register-verify',
  templateUrl: './register-verify.component.html',
  styleUrls: ['./register-verify.component.css']
})
export class RegisterVerifyComponent implements OnInit {

  form: FormGroup;
  newUser: any;
  isLoading: Boolean = false;

  constructor(
    private userApiService: ApiService,
    public notify: NotifyService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      account_id: new FormControl({ value: '', disabled: true }, [Validators.required]),
      keyVerify: new FormControl({ value: '', disabled: true }, [Validators.required]),
      codeVerify: new FormControl('', [Validators.required])
    });

  }

  submit() {
  }

  resendVerifyCode() {
    console.log('resendVerifyCode');
  }
}
