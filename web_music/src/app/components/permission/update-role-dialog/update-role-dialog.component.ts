import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-update-role-dialog',
  templateUrl: './update-role-dialog.component.html',
  styleUrls: ['./update-role-dialog.component.css']
})
export class UpdateRoleDialogComponent implements OnInit {
updateRole:FormGroup;
  constructor(private dataService: DataService,
    public dialogRef: MatDialogRef<UpdateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public currentRole) { 
      //console.log(this.currentPermission);
    }

  ngOnInit() {
    this.updateRole = new FormGroup({
      name: new FormControl(this.currentRole.name, [Validators.required]),
      id: new FormControl(this.currentRole.id, []),
      display_name: new FormControl(this.currentRole.display_name, [Validators.required]),
      language: new FormControl(this.currentRole.language, [Validators.required]),
      description: new FormControl(this.currentRole.description, [Validators.required]),
      module: new FormControl(this.currentRole.module, [Validators.required])
    })  }
    onNoClick(needUpdate: boolean): void {
      this.dialogRef.close(needUpdate);
    }
  
    submit() {
      this.dialogRef.close(this.updateRole.getRawValue());
    }
}
