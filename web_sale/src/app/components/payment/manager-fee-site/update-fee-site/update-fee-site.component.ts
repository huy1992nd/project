import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../../../../services/api.service';
import { DataService } from './../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-update-fee-site',
  templateUrl: './update-fee-site.component.html',
  styleUrls: ['./update-fee-site.component.css']
})
export class UpdateFeeSiteComponent implements OnInit {
  @Input() FeeSite: any;
  current_user: any;
  listType: any = [
    {name:'Deposit', value:'deposit'},
    {name:'Widthdraw', value:'widthdraw'},
  ];

  listPromotion: any = [
    {name:'Giảm 0%', value: 0 },
    {name:'Giảm 10%', value: 1 },
  ];
  formProfile: FormGroup;
  account_validation_messages = {
    'fee': [
      { type: 'required', message: 'Phí không được để trống' },
      { type: 'min', message: 'Phí không được âm' }
    ]
    };
  constructor(
    public translate: TranslateService,
    private apiService: ApiService,
    private dataService: DataService,
    public notify: NotifyService
  ) { }

  ngOnInit() {
    this.formProfile = new FormGroup({
      site: new FormControl(
        {
          value:this.FeeSite.site,
          disabled:true
        }
        , [Validators.required]),
      type: new FormControl(
        {
          value:this.FeeSite.type,
          disabled:true
        }
        , [Validators.required]),
      fee: new FormControl(this.FeeSite.fee, [Validators.required,Validators.min(0)]),
      promotion_id: new FormControl(this.FeeSite.promotion_id, [Validators.required]),
      description: new FormControl(this.FeeSite.description, []),
      id: new FormControl(this.FeeSite.id, []),
    });
    this.current_user = this.dataService.currentUser.getValue();
  }

  submit() {
    if (this.formProfile.valid) {
      this.apiService.updateFee(this.formProfile.value).then(result => {
        if (result.result_code == 0) {
          this.notify.success('Cập nhật thông tin fee  thành công');
          this.apiService.listFee({
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
