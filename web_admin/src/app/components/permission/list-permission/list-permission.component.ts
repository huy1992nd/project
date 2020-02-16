import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CreatePermissionDialogComponent } from './../create-permission-dialog/create-permission-dialog.component';
import { UpdatePermissionDialogComponent } from './../update-permission-dialog/update-permission-dialog.component';
import { DeletePermissionDialogComponent } from './../delete-permission-dialog/delete-permission-dialog.component';
import { ApiService } from './../../../services/api.service';
import { DataService } from './../../../services/data.service';
import { NotifyService } from './../../../services/notify.service'
@Component({
  selector: 'app-list-permission',
  templateUrl: './list-permission.component.html',
  styleUrls: ['./list-permission.component.css']
})
export class ListPermissionComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  public searchForm: FormControl;
  expandedElement: any;
  permission_table: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator ;
  displayedColumns: string[] = ['number', 'name', 'display_name', 'description', 'language', 'module', 'create_date', 'action'];

  constructor(
    public translate: TranslateService,
    private dataService: DataService,
    private dialog: MatDialog,
    private apiService: ApiService,
    public notifyService: NotifyService) {
     }


  ngOnInit() {
    this.permission_table.filterPredicate = this.tableFilter();
    let list = this.dataService.listPermission.getValue();
    if (list) {
      this.permission_table.data = list;
      // this.permission_table.paginator = this.paginator;
    } else {
      this.getListPermission();
      this.dataService.listPermission.pipe(takeUntil(this.unsubscribe$))
        .subscribe(data => {
          if (data != null && data)
            this.permission_table.data = data;
        })
    }

    this.searchForm = new FormControl('');
    this.searchForm.valueChanges.subscribe(v => {
      var criteria = {
        name: v
      };
      this.permission_table.filterPredicate = this.tableFilter();
      this.applyFilter(JSON.stringify(criteria));
    })
  }

  applyFilter(filter: string) {
    this.permission_table.filter = filter;
  }
  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.name.toLowerCase().indexOf(searchTerms.name) !== -1
        || data.display_name.toString().toLowerCase().indexOf(searchTerms.name) !== -1
    }
    return filterFunction;
  }

  createNewPermission() {
    let dialogRef = this.dialog.open(CreatePermissionDialogComponent, {
      width: '60%',
      minWidth: '500px',
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('create', result);
      if (result) {
        this.apiService.createPermission(result).then((response) => {
          console.log(response)
          if (response.result_code == 0) {
            this.notifyService.success(this.translate.instant('list-permission.CreateSuccessMessage'));
            this.getListPermission();
          } else {
            this.notifyService.error(this.translate.instant(`error_code.${response.result_code}`));
          }
        })
      }
    });
  }

  DeletePermission(data) {
    let dialogRef = this.dialog.open(DeletePermissionDialogComponent, {
      width: '30%',
      minWidth: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListPermission();
      }
    });
  }

  UpdatePermission(data) {
    let dialogRef = this.dialog.open(UpdatePermissionDialogComponent, {
      width: '60%',
      minWidth: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updatePermission(result).then((response) => {
          console.log(response);
          if (response.result_code == 0) {
            this.notifyService.success(this.translate.instant('list-permission.UpdateSuccessMessage'));
            this.getListPermission();
          } else {
            this.notifyService.error(this.translate.instant(`error_code.${result.result_code}`));
          }

        })
      }
    });
  }

  getListPermission() {
    console.log('get data from api')
    this.apiService.listPermission({}).then(data => {
      if (data && data.result_code == 0) {
        this.permission_table.data = data.data;
        this.dataService.listPermission.next(this.permission_table.data);
      } else {
        if(data)
        this.notifyService.error(data.result_code);
      }
    })
  }
  ngAfterViewInit() {
    this.permission_table.paginator = this.paginator;
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
