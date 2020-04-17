import { Component, OnInit, Inject } from '@angular/core';
import {NotifyService} from './../../../services/notify.service';
import {ApiService} from './../../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-permission-dialog',
  templateUrl: './delete-permission-dialog.component.html',
  styleUrls: ['./delete-permission-dialog.component.css']
})
export class DeletePermissionDialogComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    public notify: NotifyService,
    public dialogRef: MatDialogRef<DeletePermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public permission
  ) { }

  ngOnInit() {
  }

  confirmRemovePermission() {

    this.apiService.deletePermission({name:this.permission.name}).then(result => {
      if (result.result_code == 0) {
        this.notify.success("Xóa permission thành công");
        this.onNoClick(true);
      } else {
        this.notify.error("Xóa permission thất bại, xin vui lòng thử lại");
        this.onNoClick(false);
      }
    })
      .catch(error => {
        this.notify.error("Xóa permission thất bại, xin vui lòng thử lại");
        this.onNoClick(false);
      });
  }

  onNoClick(needUpdate: boolean): void {
    this.dialogRef.close(needUpdate);
  }


}
