import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';
import { checkDifferentValidator } from 'src/app/common/ultilities';
@Component({
  selector: 'app-create-rate-site-dialog',
  templateUrl: './create-rate-site-dialog.component.html',
  styleUrls: ['./create-rate-site-dialog.component.css']
})
export class CreateRateSiteDialogComponent implements OnInit {

  isLoading: Boolean = false;
  showPassword: Boolean = false;
  showConfirmPassword: Boolean = false;
  public checkDifferentValidator: Boolean = false;
  createRate: FormGroup;
  listCurrencies:any =[];
  listType: any = [
    {name:'widthdraw',value:'widthdraw'},
    {name:'deposit',value:'deposit'}
  ]
  constructor(
    public translate: TranslateService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<CreateRateSiteDialogComponent>,
    private apiService: ApiService,
    public notify: NotifyService
    ) { }
    account_validation_messages = {
      'right': [
        { type: 'required', message: 'right không được để trống' },
      ],
      'left': [
        { type: 'required', message: 'left không được để trống' },
        { type: 'checkdifferent', message: 'Right phải khác left' }
      ],
      'rate': [
        { type: 'required', message: 'Tỷ giá không được để trống' },
        { min: 'required', message: 'Tỷ giá không được âm' }
      ],
      'type': [
        { type: 'required', message: 'Type khoản không được để trống' },
      ],
      };
  
    ngOnInit() {
      this.getListCurrenccies();
      this.dataService.listCurrencies.subscribe(data => {
        if (!data)
          return;
        this.listCurrencies = this.dataService.listCurrencies.getValue();
      });
      this.createRate = new FormGroup({
          right: new FormControl('', [Validators.required]),
          left: new FormControl('', [Validators.required]),
          rate: new FormControl('', [Validators.required,Validators.min(0) ]),
          type: new FormControl('', [Validators.required]),
          site: new FormControl(document.location.hostname, []),
        }, {validators: [checkDifferentValidator]  });
    }

    getListCurrenccies() {
      let list = this.dataService.listCurrencies.getValue();
      if (list) {
        this.listCurrencies = list;
      } else {
        this.apiService.listCurrencies({
          site: document.location.hostname
        }).then(data => {});
      }
    }
  
    onNoClick(needUpdate: boolean): void {
      this.dialogRef.close(needUpdate);
    }
  
    submit() {
      if (this.createRate.valid) {
        let data = this.createRate.value;
        this.apiService.addRateSite(data).then(result => {
          if (result.result_code == 0) {
            this.notify.success('Lưu thông tin tài khoản ngân hàng thành công');
            this.apiService.listRateSite({
              site:document.location.hostname
            }).then(data => {});
            this.dialogRef.close(this.createRate.getRawValue());
          } else {
            this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
          }
        }).catch(error => {
        })
       
      }
    }
}

