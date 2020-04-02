
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiService } from './../../../services/api.service';
import { DataService } from './../../../services/data.service';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { CreateUserDialogComponent } from './../create-user-dialog/create-user-dialog.component';
import { UpdateUserDialogComponent } from './../update-user-dialog/update-user-dialog.component';
import { BlockUserDialogComponent } from './../block-user-dialog/block-user-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class ListUserComponent implements OnInit, OnDestroy {
  public searchForm: FormGroup;
  listUser: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  currentUser: any;
  expandedElement: any;
  myProductList: any;
  ctvProductList: any = [];
  listSite: any = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['number', 'account', 'name', 'email', 'site', 'permission', 'status', 'action'];
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(
    private userApiService: ApiService,
    private userDataService: DataService,
    private dialog: MatDialog
  ) {
  }
  get user_name() { return this.searchForm.get('user_name') };
  ngOnInit() {
    this.listUser.filterPredicate = this.tableFilter();
    this.searchForm = new FormGroup({
      search_str: new FormControl(),
      site: new FormControl(),
    });

    this.currentUser = this.userDataService.currentUser.getValue();

    this.myProductList = [];
    this.listUser.data = [];
    this.getListUser();
    this.searchForm.valueChanges.subscribe(v => {
      var criteria = {
        search_str: v.search_str ? v.search_str : "",
        site: v.site? v.site : ""
      };
      this.listUser.filterPredicate = this.tableFilter();
      this.applyFilter(JSON.stringify(criteria));
    });
    this.userDataService.listUser.subscribe(data=>{
      if(!data)
          return;
          this.listUser.data = this.userDataService.listUser.getValue();
          this.listSite = [...new Set(this.userDataService.listUser.getValue().map(item => item.site))];
          // this.listUser.paginator = this.paginator;
    })
  }

  async InitData() {
    return new Promise(resolve => {
      resolve();
    })
  }

  applyFilter(filter: string) {
    this.listUser.filter = filter;
  }

  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (data.user_name.toLowerCase().indexOf(searchTerms.search_str) !== -1
        || data.account_id.toString().toLowerCase().indexOf(searchTerms.search_str) !== -1
        || data.mail.toString().toLowerCase().indexOf(searchTerms.search_str) !== -1)
        && data.site.indexOf(searchTerms.site) !== -1
    }
    return filterFunction;
    }

  ngOnDestroy() {

  }

  CreateUser() {
    let dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '40%',
      minWidth: '500px',
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {

      }
    });
  }

  UpdateUser(user) {
    let dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      width: '40%',
      minWidth: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {

      }
    });
  }

  BlockUser(user){
    const dialogRef = this.dialog.open(BlockUserDialogComponent, {
      width: '30%',
      minWidth: '500px',
      data: user
    });

  }

  getListUser() {
    let list = this.userDataService.listUser.getValue();
    if (list) {
      this.listUser.data = list;
    } else {
      this.userApiService.listUser({}).then(data => {
        if (data.data != undefined) {
          let userListArr = data.data.sort((a, b) => +new Date(b.create_date) - +new Date(a.create_date));
          this.userDataService.listUser.next(userListArr);
        }
      });
    }
  }
  ngAfterViewInit() {
    this.listUser.paginator = this.paginator
}

  resetForm($event, formControl: AbstractControl, needReset) {
    if (!needReset) {
      return;
    }
    formControl.setValue('');
    $event.stopPropagation();
  }

}
