import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core"
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DataService} from './../../../services/data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-role-dialog',
  templateUrl: './create-role-dialog.component.html',
  styleUrls: ['./create-role-dialog.component.css']
})
export class CreateRoleDialogComponent implements OnInit {

  constructor(private dataService: DataService,public translate: TranslateService,public dialogRef: MatDialogRef<CreateRoleDialogComponent>) { }
  createRole:FormGroup;
  ngOnInit() {
    this.createRole = new FormGroup({
      name: new FormControl('', [Validators.required]),
      display_name: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    })
  }
  onNoClick(needUpdate: boolean): void {
    this.dialogRef.close(needUpdate);
  }

  submit() {
    this.dialogRef.close(this.createRole.getRawValue());
  }

}
