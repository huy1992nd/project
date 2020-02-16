import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-create-bank-dialog',
  templateUrl: './create-bank-dialog.component.html',
  styleUrls: ['./create-bank-dialog.component.css']
})
export class CreateBankDialogComponent implements OnInit {

  isLoading: Boolean = false;
  showPassword: Boolean = false;
  showConfirmPassword: Boolean = false;
  confirmPasswordValidator: Boolean = false;
  createBank: FormGroup;
  constructor(
    public translate: TranslateService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<CreateBankDialogComponent>,
    private apiService: ApiService,
    public notify: NotifyService
    ) { }
    account_validation_messages = {
      'name': [
        { type: 'required', message: 'Username không được để trống' },
        { type: 'minlength', message: 'Username không được dưới 3 kí tự' }
      ],
      'code': [
        { type: 'required', message: 'Account_id không được để trống' },
        { type: 'minlength', message: 'Account id không được dưới 6 kí tự' },
        {type:'pattern', message:'Account id không được có dấu cách'}
      ],
      'country_code': [
        { type: 'required', message: 'Email không được để trống' },
        { type: 'email', message: 'Email không đúng' }
      ],
      'language': [
        { type: 'required', message: 'Ngôn ngữ không được để trống' }
      ]
      };
  
    ngOnInit() {
      this.createBank = new FormGroup({
          name: new FormControl('', [Validators.required]),
          code: new FormControl('', [Validators.required]),
          country_code: new FormControl('', [Validators.required]),
          language: new FormControl('', [Validators.required]),
        }, { validators: [] });
    }
  
    onNoClick(needUpdate: boolean): void {
      this.dialogRef.close(needUpdate);
    }
  
    submit() {
      if (this.createBank.valid) {
        let data = this.createBank.value;
        this.apiService.addBank(data).then(result => {
          if (result.result_code == 0) {
            this.notify.success('Tạo ngân hàng thành công');
            this.apiService.listBank({
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
