import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../../services/data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';


@Component({
  selector: 'app-delete-rate-site-dialog',
  templateUrl: './delete-rate-site-dialog.component.html',
  styleUrls: ['./delete-rate-site-dialog.component.css']
})
export class DeleteRateSiteDialogComponent implements OnInit {

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<DeleteRateSiteDialogComponent>,
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
    this.apiService.deleteRateSite({
      id: this.account.id
    }).then(result => {
      if (result.result_code == 0) {
        this.notify.success('Xóa rate thành công');
        this.apiService.listRateSite({
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

