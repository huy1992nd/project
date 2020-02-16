import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../services/data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';
@Component({
  selector: 'app-block-user-dialog',
  templateUrl: './block-user-dialog.component.html',
  styleUrls: ['./block-user-dialog.component.css']
})
export class BlockUserDialogComponent implements OnInit {

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<BlockUserDialogComponent>,
    public translate: TranslateService,
    private userApiService: ApiService,
    public notify: NotifyService,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) { }

  ngOnInit() {
  }

  onNoClick(needUpdate: boolean): void {
    this.dialogRef.close(needUpdate);
  }

  submit() {
    let active = this.user.active == 1 ? -1 : 1;
    this.userApiService.userActive({
      active: active,
      account_id: this.user.account_id,
      site: window.location.hostname
    }).then(result => {
      if (result.result_code == 0) {
        this.notify.success('Cập nhật khoản thành công');
        this.userApiService.listUser({}).then(data => {
          if (data.data != undefined) {
            let userListArr = data.data.sort((a, b) => +new Date(b.create_date) - +new Date(a.create_date));
            this.dataService.listUser.next(userListArr);
          }
        });
        this.dialogRef.close(false);
      } else {
        this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
      }
    }).catch(error => {
    })
  }

}
