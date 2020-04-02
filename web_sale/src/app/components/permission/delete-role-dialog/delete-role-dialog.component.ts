import { Component, OnInit, Inject } from '@angular/core';
import {NotifyService} from './../../../services/notify.service';
import {ApiService} from './../../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-delete-role-dialog',
  templateUrl: './delete-role-dialog.component.html',
  styleUrls: ['./delete-role-dialog.component.css']
})
export class DeleteRoleDialogComponent implements OnInit {

  constructor( private apiService: ApiService,
    public notify: NotifyService,
    public dialogRef: MatDialogRef<DeleteRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public role
  ) { }

  ngOnInit() {
  }
  confirmRemoveRole() {

    this.apiService.deleteRole({name:this.role.name}).then(result => {
      if (result.result_code == 0) {
        this.notify.success("Xóa role thành công");
        this.onNoClick(true);
      } else {
        this.notify.error("Xóa role thất bại, xin vui lòng thử lại");
        this.onNoClick(false);
      }
    })
      .catch(error => {
        this.notify.error("Xóa role thất bại, xin vui lòng thử lại");
        this.onNoClick(false);
      });
  }

  onNoClick(needUpdate: boolean): void {
    this.dialogRef.close(needUpdate);
  }

}
