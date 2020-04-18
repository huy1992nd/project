import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUserComponent } from './list-user/list-user.component';

import { UpdateUserPermissionComponent } from './update-user-permission/update-user-permission.component';
import {MatAngularModule} from './../../common/mat-angular.module';
import { UserComponent } from './user.component';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component'
import { AppRoutingModule } from './../../app-routing.module';
import { FormsModule ,ReactiveFormsModule}   from '@angular/forms';
import { UpdateUserDialogComponent } from './update-user-dialog/update-user-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockUserDialogComponent } from './block-user-dialog/block-user-dialog.component';
import { UserItemExpansionComponent } from './user-item-expansion/user-item-expansion.component';
import { ManagerRolePermissionComponent } from './user-item-expansion/manager-role-permission/manager-role-permission.component';
import { UserShowInforComponent } from './user-item-expansion/user-show-infor/user-show-infor.component'; 
import { ConvertPermissionPipe } from './../../pipes/convert-permission.pipe';
@NgModule({
  declarations: [ListUserComponent, UpdateUserPermissionComponent, UserComponent, CreateUserDialogComponent, UpdateUserDialogComponent, BlockUserDialogComponent, UserItemExpansionComponent, ManagerRolePermissionComponent, UserShowInforComponent, ConvertPermissionPipe],
  imports: [
    CommonModule,
    MatAngularModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    
  ],
  exports: [
    UserComponent
  ]
,  entryComponents: [
  CreateUserDialogComponent,
  UpdateUserDialogComponent,
  BlockUserDialogComponent
]
})
export class UserModule { }
