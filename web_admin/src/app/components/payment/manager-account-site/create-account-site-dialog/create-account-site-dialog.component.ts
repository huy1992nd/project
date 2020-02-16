import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-create-account-site-dialog',
  templateUrl: './create-account-site-dialog.component.html',
  styleUrls: ['./create-account-site-dialog.component.css']
})
export class CreateAccountSiteDialogComponent implements OnInit {

  isLoading: Boolean = false;
  showPassword: Boolean = false;
  showConfirmPassword: Boolean = false;
  confirmPasswordValidator: Boolean = false;
  createBank: FormGroup;
  listBank:any =[];
  constructor(
    public translate: TranslateService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<CreateAccountSiteDialogComponent>,
    private apiService: ApiService,
    public notify: NotifyService
    ) { }
    account_validation_messages = {
      'country_code': [
        { type: 'required', message: 'Mã đất nước không được để trống' },
      ],
      'bank_code': [
        { type: 'required', message: 'Mã ngân hàng không được để trống' },
      ],
      'account_number': [
        { type: 'required', message: 'Số tài khoản không được để trống' },
      ],
      'account_user_name': [
        { type: 'required', message: 'Tên tài khoản không được để trống' },
      ],
      };
  
    ngOnInit() {
      this.getListBank();
      this.dataService.listBank.subscribe(data => {
        if (!data)
          return;
        this.listBank = this.dataService.listBank.getValue();
      });
      this.createBank = new FormGroup({
          country_code: new FormControl('', [Validators.required]),
          bank_code: new FormControl('', [Validators.required]),
          account_number: new FormControl('', [Validators.required]),
          account_user_name: new FormControl('', [Validators.required]),
          branch: new FormControl('', []),
          deposit: new FormControl('', []),
          site: new FormControl(document.location.hostname, []),
          status: new FormControl(0, [])
        }, { validators: [] });
    }

    getListBank() {
      let list = this.dataService.listBank.getValue();
      if (list) {
        this.listBank = list;
      } else {
        this.apiService.listBank({
          site: document.location.hostname
        }).then(data => {});
      }
    }
  
    onNoClick(needUpdate: boolean): void {
      this.dialogRef.close(needUpdate);
    }
  
    submit() {
      if (this.createBank.valid) {
        let data = this.createBank.value;
        this.apiService.addBankAccount(data).then(result => {
          if (result.result_code == 0) {
            this.notify.success('Lưu thông tin tài khoản ngân hàng thành công');
            this.apiService.listBankAccount({
              site:document.location.hostname
            }).then(data => {});
            this.dialogRef.close(this.createBank.getRawValue());
          } else {
            this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
          }
        }).catch(error => {
        })
       
      }
    }
}
