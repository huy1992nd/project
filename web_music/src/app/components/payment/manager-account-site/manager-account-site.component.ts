
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiService } from './../../../services/api.service';
import { DataService } from './../../../services/data.service';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { CreateAccountSiteDialogComponent } from './create-account-site-dialog/create-account-site-dialog.component';
import { DeleteAccountSiteDialogComponent } from './delete-account-site-dialog/delete-account-site-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-manager-account-site',
  templateUrl: './manager-account-site.component.html',
  styleUrls: ['./manager-account-site.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManagerAccountSiteComponent implements OnInit {

  public searchForm: FormGroup;
  listAccount: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  currentUser: any;
  expandedElement: any;
  myProductList: any;
  ctvProductList: any = [];
  listSite: any = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['number', 'country_code', 'bank_name', 'bank_code', 'account_number', 'account_user_name', 'branch', 'deposit', 'status', 'action'];
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
  }
  ngOnInit() {
    this.listAccount.filterPredicate = this.tableFilter();
    this.searchForm = new FormGroup({
      search_str: new FormControl(),
      site: new FormControl(),
    });

    this.currentUser = this.dataService.currentUser.getValue();

    this.myProductList = [];
    this.listAccount.data = [];
    this.getListAccount();
    this.searchForm.valueChanges.subscribe(v => {
      var criteria = {
        search_str: v.search_str ? v.search_str : ""
      };
      this.listAccount.filterPredicate = this.tableFilter();
      this.applyFilter(JSON.stringify(criteria));
    });
    this.dataService.listBankAccount.subscribe(data=>{
      if(!data)
          return;
          this.listAccount.data = this.dataService.listBankAccount.getValue();
    })
  }

  async InitData() {
    return new Promise(resolve => {
      resolve();
    })
  }

  applyFilter(filter: string) {
    this.listAccount.filter = filter;
  }

  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.account_number.toLowerCase().indexOf(searchTerms.search_str) !== -1
        || data.account_user_name.toString().toLowerCase().indexOf(searchTerms.search_str) !== -1
        || data.bank_code.toString().toLowerCase().indexOf(searchTerms.search_str) !== -1
    }
    return filterFunction;
    }

  ngOnDestroy() {

  }

  CreateBankAccount() {
    let dialogRef = this.dialog.open(CreateAccountSiteDialogComponent, {
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

  deleteBankAccount(user){
    const dialogRef = this.dialog.open(DeleteAccountSiteDialogComponent, {
      width: '30%',
      minWidth: '500px',
      data: user
    });

  }

  getListAccount() {
    let list = this.dataService.listBankAccount.getValue();
    if (list) {
      this.listAccount.data = list;
    } else {
      this.apiService.listBankAccount({
        site:document.location.hostname
      }).then(data => {});
    }
  }
  ngAfterViewInit() {
    this.listAccount.paginator = this.paginator
}

  resetForm($event, formControl: AbstractControl, needReset) {
    if (!needReset) {
      return;
    }
    formControl.setValue('');
    $event.stopPropagation();
  }

}
