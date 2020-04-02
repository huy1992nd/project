import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPermissionComponent } from './list-permission/list-permission.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { PermissionComponent } from './permission.component';
import {MatAngularModule} from './../../common/mat-angular.module';
import {TranslateModule} from '@ngx-translate/core';
import {NotifyService} from './../../services/notify.service'
import { FormsModule ,ReactiveFormsModule}   from '@angular/forms';
import { CreatePermissionDialogComponent } from './create-permission-dialog/create-permission-dialog.component';
import { UpdatePermissionDialogComponent } from './update-permission-dialog/update-permission-dialog.component';
import { DeletePermissionDialogComponent } from './delete-permission-dialog/delete-permission-dialog.component';
import { CreateRoleDialogComponent } from './create-role-dialog/create-role-dialog.component';
import { UpdateRoleDialogComponent } from './update-role-dialog/update-role-dialog.component';
import { DeleteRoleDialogComponent } from './delete-role-dialog/delete-role-dialog.component';
import { ListPermissionByRoleComponent } from './list-role/list-permission-by-role/list-permission-by-role.component';
import { AddPermissionToRoleDialogComponent } from './list-role/add-permission-to-role-dialog/add-permission-to-role-dialog.component';
import { RemovePermissionFromRoleDialogComponent } from './list-role/remove-permission-from-role-dialog/remove-permission-from-role-dialog.component';
import { RoleItemExpansionComponent } from './list-role/role-item-expansion/role-item-expansion.component'


@NgModule({
  declarations: [PermissionComponent,ListPermissionComponent
     , ListRoleComponent, CreatePermissionDialogComponent, UpdatePermissionDialogComponent, DeletePermissionDialogComponent, CreateRoleDialogComponent, UpdateRoleDialogComponent, DeleteRoleDialogComponent, ListPermissionByRoleComponent, AddPermissionToRoleDialogComponent, RemovePermissionFromRoleDialogComponent, RoleItemExpansionComponent],
  imports: [
    CommonModule,MatAngularModule,TranslateModule,FormsModule,
    ReactiveFormsModule
  ],exports: [PermissionComponent],
  entryComponents:[CreatePermissionDialogComponent,UpdatePermissionDialogComponent,DeletePermissionDialogComponent,CreateRoleDialogComponent, UpdateRoleDialogComponent, DeleteRoleDialogComponent],
  providers: [NotifyService]
})
export class PermissionModule { }


