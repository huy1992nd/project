import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../../services/data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';


@Component({
  selector: 'app-delete-account-site-dialog',
  templateUrl: './delete-account-site-dialog.component.html',
  styleUrls: ['./delete-account-site-dialog.component.css']
})
export class DeleteAccountSiteDialogComponent implements OnInit {

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<DeleteAccountSiteDialogComponent>,
    public translate: TranslateService,
    private apiService: ApiService,
    public notify: NotifyService,
    @Inject(MAT_DIALOG_DATA) public account: any
  ) { }

  ngOnInit() {
  }

  onNoClick(needUpdate: boolean): void {
    this.dialogRef.close(needUpdate);
  }

  submit() {
    this.apiService.deleteBankAccount({
      id: this.account.id
    }).then(result => {
      if (result.result_code == 0) {
        this.notify.success('Xóa tài khoản thành công');
        this.apiService.listBankAccount({
          site: document.location.hostname
        }).then(data => {});
        this.dialogRef.close(false);
      } else {
        this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
      }
    }).catch(error => {
    })
  }

}
