import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { ApiService } from './../../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-update-permission-dialog',
  templateUrl: './update-permission-dialog.component.html',
  styleUrls: ['./update-permission-dialog.component.css']
})
export class UpdatePermissionDialogComponent implements OnInit {
  unsubscribe$ = new Subject();
  createPermission:FormGroup;
  module:any=[];
  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<UpdatePermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public currentPermission) { 
      //console.log(this.currentPermission);
    }

  ngOnInit() {
    this.getListModule();
    this.dataService.listModule.pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if (data != null && data)
        this.module = data;
    })
    this.createPermission = new FormGroup({
      name: new FormControl(this.currentPermission.name, [Validators.required]),
      id: new FormControl(this.currentPermission.id, []),
      display_name: new FormControl(this.currentPermission.display_name, [Validators.required]),
      language: new FormControl(this.currentPermission.language, [Validators.required]),
      description: new FormControl(this.currentPermission.description, [Validators.required]),
      module: new FormControl(this.currentPermission.module, [Validators.required])
    })  }
    onNoClick(needUpdate: boolean): void {
      this.dialogRef.close(needUpdate);
    }

    getListModule() {
      let list = this.dataService.listModule.getValue();
      if (list) {
        this.module = list;
      } else {
        this.apiService.listModule({}).then(data => {});
      }
    }
  
    submit() {
      this.dialogRef.close(this.createPermission.getRawValue());
    }
}



  