import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CreateRoleDialogComponent } from './../create-role-dialog/create-role-dialog.component';
import { UpdateRoleDialogComponent } from './../update-role-dialog/update-role-dialog.component';
import { DeleteRoleDialogComponent } from './../delete-role-dialog/delete-role-dialog.component';
import { ApiService } from './../../../services/api.service';
import { DataService } from './../../../services/data.service';
import { NotifyService } from './../../../services/notify.service'
import { ListPermissionByRoleComponent } from './list-permission-by-role/list-permission-by-role.component'
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListRoleComponent implements OnInit {
  unsubscribe$ = new Subject();
  public searchForm: FormGroup;
  expandedElement: any;
  isLoaded: Boolean = false;
  currentRole: any;
  role_table: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['number', 'name', 'display_name', 'description', 'action', 'id'];

  constructor(public translate: TranslateService, private dataService: DataService, private dialog: MatDialog, private apiService: ApiService, public notifyService: NotifyService) { }


  async ngOnInit() {
    this.role_table.filterPredicate = this.tableFilter();
    this.searchForm = new FormGroup({
      search_str: new FormControl()
    });
    this.searchForm.valueChanges.subscribe(v => {
      var criteria = {
        search_str: v.search_str ? v.search_str : ""
      };
      this.role_table.filterPredicate = this.tableFilter();
      this.applyFilter(JSON.stringify(criteria));
    });
    let list = this.dataService.listRole.getValue();
    if (list) {
      this.role_table.data = list;
      this.currentRole = this.role_table.data[0];
    } else {
      this.getListRole();
    }
    this.isLoaded = true;
    this.dataService.listRole.pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        if (data != null && data)
          this.role_table.data = data;
      })
     
  }
  ngAfterViewInit() {
    this.role_table.paginator = this.paginator;
  }

  changeRole(role) {
    this.currentRole = role;
  }

  applyFilter(filter: string) {
    this.role_table.filter = filter;
  }
  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.name.toLowerCase().indexOf(searchTerms.search_str) !== -1
        || data.display_name.toString().toLowerCase().indexOf(searchTerms.search_str) !== -1
    }
    return filterFunction;
    }

  createNewRole() {
    let dialogRef = this.dialog.open(CreateRoleDialogComponent, {
      width: '60%',
      minWidth: '500px',
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('create', result);
      if (result) {
        this.apiService.createRole(result).then((response) => {
          console.log(response)
          if (response.result_code == 0) {
            this.notifyService.success(this.translate.instant('list-role.CreateSuccessMessage'));
            this.getListRole();
          } else {
            this.notifyService.error(this.translate.instant(`error_code.${response.result_code}`));
          }
        })
      }
    });
  }
  DeleteRole(data) {
    let dialogRef = this.dialog.open(DeleteRoleDialogComponent, {
      width: '30%',
      minWidth: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListRole();
      }
    });
  }
  UpdateRole(data) {
    let dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
      width: '60%',
      minWidth: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateRole(result).then((response) => {
          console.log(response);
          if (response.result_code == 0) {
            this.notifyService.success(this.translate.instant('list-role.UpdateSuccessMessage'));
            // this.notifyService.success(this.translate.instant('list-permission.UpdateSuccessMessage'));
            this.getListRole();
          } else {
            this.notifyService.error(this.translate.instant(`error_code.${result.result_code}`));
          }

        })
      }
    });
  }

  getListRole() {
    this.apiService.listRole({}).then(data => {
      if (data && data.result_code == 0) {
        this.role_table.data = data.data;
        this.currentRole = this.role_table.data[0];
      } else {
        if(data){
          this.notifyService.error(data.result_code);
        }
      }
    })
  }

  resetForm($event, formControl: AbstractControl, needReset) {
    if (!needReset) return;
    formControl.setValue('');
    $event.stopPropagation();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
