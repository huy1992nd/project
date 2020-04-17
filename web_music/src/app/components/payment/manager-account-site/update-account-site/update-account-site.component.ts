import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../../../../services/api.service';
import { DataService } from './../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-update-account-site',
  templateUrl: './update-account-site.component.html',
  styleUrls: ['./update-account-site.component.css']
})
export class UpdateAccountSiteComponent implements OnInit {
  @Input() AccountSite: any;
  current_user: any;
  listBank:any =[];
  listStatus: any = [
    {name:'Active', value:1},
    {name:'Not active', value:0},
  ];
  formProfile: FormGroup;
  account_validation_messages = {
    'country_code': [
      { type: 'required', message: 'Đất nước không được để trống' }
    ],
    'bank_code': [
      { type: 'required', message: 'Mã ngân hàng không được để trống' }
    ],
    'account_number': [
      { type: 'required', message: 'Số tài khoản không được để trống' }
    ],
    'account_user_name': [
      { type: 'minlength', message: 'Tên tài khoản không được để trống' }
    ]
    };
  constructor(
    public translate: TranslateService,
    private apiService: ApiService,
    private dataService: DataService,
    public notify: NotifyService
  ) { }

  ngOnInit() {
    this.getListBank();

    this.initSubscribe();
    this.formProfile = new FormGroup({
      country_code: new FormControl(this.AccountSite.country_code, [Validators.required]),
      bank_code: new FormControl(
        {
          value:this.AccountSite.bank_code,
          disabled:true
        }
        , [Validators.required]),
      account_number: new FormControl(this.AccountSite.account_number, [Validators.required]),
      account_user_name: new FormControl(this.AccountSite.account_user_name, [Validators.required]),
      branch: new FormControl(this.AccountSite.branch, []),
      deposit: new FormControl(this.AccountSite.deposit, []),
      site: new FormControl(document.location.hostname, []),
      status: new FormControl(this.AccountSite.status, []),
      id: new FormControl(this.AccountSite.id, []),
    });
    this.current_user = this.dataService.currentUser.getValue();
  }

  initSubscribe() {
   this.dataService.listBank.subscribe(data => {
        if (!data)
          return;
        this.listBank = this.dataService.listBank.getValue();
      });

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

  submit() {
    if (this.formProfile.valid) {
      this.apiService.updateBankAccount(this.formProfile.value).then(result => {
        if (result.result_code == 0) {
          this.notify.success('Cập nhật thông tin tài khoản thành công');
          this.apiService.listBankAccount({
            site:document.location.hostname
          }).then(data => {});
        }else{
          this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
        }
      }).catch(error => {
      })
    }
  }

}
