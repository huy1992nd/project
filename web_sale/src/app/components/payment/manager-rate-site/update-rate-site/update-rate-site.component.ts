import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../../../../services/api.service';
import { DataService } from './../../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-update-rate-site',
  templateUrl: './update-rate-site.component.html',
  styleUrls: ['./update-rate-site.component.css']
})
export class UpdateRateSiteComponent implements OnInit {
  @Input() RateSite: any;
  current_user: any;
  listCurrencies:any =[];
  listType: any = [
    {name:'widthdraw',value:'widthdraw'},
    {name:'deposit',value:'deposit'}
  ]
  formUpdate: FormGroup;
  account_validation_messages = {
    'left': [
      { type: 'required', message: 'left không được để trống' }
    ],
    'right': [
      { type: 'required', message: 'Right không được để trống' }
    ],
    'rate': [
      { type: 'required', message: 'Tỷ giá không được để trống' },
      { type: 'min', message: 'Tỷ giá không được âm' },
    ],
    'type': [
      { type: 'required', message: 'Type không được để trống' }
    ]
  };
  constructor(
    public translate: TranslateService,
    private apiService: ApiService,
    private dataService: DataService,
    public notify: NotifyService
  ) { }

  ngOnInit() {
    this.getListCurrenccies();
      this.dataService.listCurrencies.subscribe(data => {
        if (!data)
          return;
        this.listCurrencies = this.dataService.listCurrencies.getValue();
      });

    this.formUpdate = new FormGroup({
      left: new FormControl(
        {
          value: this.RateSite.left,
          disabled: true
        }
        , [Validators.required]),
      right: new FormControl(
        {
          value: this.RateSite.right,
          disabled: true
        }
        , [Validators.required]),
      rate: new FormControl(this.RateSite.rate, [Validators.required, Validators.min(0)]),
      type: new FormControl(this.RateSite.type, [Validators.required]),
      site: new FormControl(document.location.hostname),
      id: new FormControl(this.RateSite.id),
    });
    this.current_user = this.dataService.currentUser.getValue();
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

  submit() {
    if (this.formUpdate.valid) {
      this.apiService.updateRateSite(this.formUpdate.value).then(result => {
        if (result.result_code == 0) {
          this.notify.success('Cập nhật rate thành công');
          this.apiService.listRateSite({
            site: document.location.hostname
          }).then(data => { });
        } else {
          this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
        }
      }).catch(error => {
      })
    }
  }

}

