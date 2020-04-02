import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../../services/data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-update-bank-dialog',
  templateUrl: './update-bank-dialog.component.html',
  styleUrls: ['./update-bank-dialog.component.css']
})
export class UpdateBankDialogComponent implements OnInit {

  updateBank: FormGroup;
  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<UpdateBankDialogComponent>,
    public translate: TranslateService,
    private apiService: ApiService,
    public notify: NotifyService,
    @Inject(MAT_DIALOG_DATA) public bank: any
    ) { }
    account_validation_messages = {
      'name': [
        { type: 'required', message: 'Tên không được để trống' },
      ],
      'code': [
        { type: 'required', message: 'Mã không được để trống' },
      ],
      'country_code': [
        { type: 'pattern', message: 'Mã đất nước không được để trống' }
      ]
      };
  
    ngOnInit() {
      this.updateBank = new FormGroup({
          name: new FormControl(this.bank.name, [Validators.required]),
          id: new FormControl(this.bank.id, [Validators.required]),
          code: new FormControl({
            value:this.bank.code,
            disabled :true
          }, [Validators.required]),
          language: new FormControl({
            value:this.bank.language,
            disabled :true
          }, [Validators.required]),
          country_code: new FormControl(this.bank.country_code, [Validators.required]),
          site: new FormControl(
            {
              value:window.location.hostname,
              disabled :true
          })
        }, {  });
    }
  
    onNoClick(needUpdate: boolean): void {
      this.dialogRef.close(needUpdate);
    }
  
    submit() {
      if (this.updateBank.valid) {
        let data = this.updateBank.value;
        this.apiService.updateBank(data).then(result => {
          if (result.result_code == 0) {
            this.notify.success('Cập nhật thông tin ngân hàng thành công');
            this.apiService.listBank({
              site:document.location.hostname
            }).then(data => {
            });
            this.dialogRef.close(this.updateBank.getRawValue());
          } else {
            this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
          }
        }).catch(error => {
        })
       
      }
    }
}
