import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../../services/data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-delete-bank-dialog',
  templateUrl: './delete-bank-dialog.component.html',
  styleUrls: ['./delete-bank-dialog.component.css']
})
export class DeleteBankDialogComponent implements OnInit {

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<DeleteBankDialogComponent>,
    public translate: TranslateService,
    private apiService: ApiService,
    public notify: NotifyService,
    @Inject(MAT_DIALOG_DATA) public bank: any
  ) { }

  ngOnInit() {
  }

  onNoClick(needUpdate: boolean): void {
    this.dialogRef.close(needUpdate);
  }

  submit() {
    this.apiService.deleteBank({
      id: this.bank.id
    }).then(result => {
      if (result.result_code == 0) {
        this.notify.success('Xóa ngân hàng thành công');
        this.apiService.listBank({}).then(data => {});
        this.dialogRef.close(false);
      } else {
        this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
      }
    }).catch(error => {
    })
  }

}

