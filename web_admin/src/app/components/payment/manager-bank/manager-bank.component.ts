
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from './../../../services/api.service';
import { DataService } from './../../../services/data.service';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { CreateBankDialogComponent } from './create-bank-dialog/create-bank-dialog.component';
import { UpdateBankDialogComponent } from './update-bank-dialog/update-bank-dialog.component';
import { DeleteBankDialogComponent } from './delete-bank-dialog/delete-bank-dialog.component';


@Component({
  selector: 'app-manager-bank',
  templateUrl: './manager-bank.component.html',
  styleUrls: ['./manager-bank.component.css']
})
export class ManagerBankComponent implements OnInit {

  public searchForm: FormGroup;
  listBank: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  listLanguage: any = [];
  currentUser: any;
  expandedElement: any;
  myProductList: any;
  ctvProductList: any = [];
  listSite: any = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['number', 'country_code', 'name', 'code' ,'action'];
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(
    private location: Location,
    private userApiService: ApiService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
  }
  get user_name() { return this.searchForm.get('user_name') };
  ngOnInit() {
    this.listBank.filterPredicate = this.tableFilter();
    this.searchForm = new FormGroup({
      search_str: new FormControl(),
      language: new FormControl(),
    });

    this.currentUser = this.dataService.currentUser.getValue();

    this.myProductList = [];
    this.listBank.data = [];
    this.getListBank();
    this.searchForm.valueChanges.subscribe(v => {
      var criteria = {
        search_str: v.search_str ? v.search_str.toLowerCase() : "",
        language: v.language ? v.language.toLowerCase() : ""
      };
      this.listBank.filterPredicate = this.tableFilter();
      this.applyFilter(JSON.stringify(criteria));
    });
    this.dataService.listBank.subscribe(data=>{
      if(!data)
          return;
          this.listBank.data = this.dataService.listBank.getValue();
    })
  }

  async InitData() {
    return new Promise(resolve => {
      resolve();
    })
  }

  applyFilter(filter: string) {
    this.listBank.filter = filter;
  }

  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (data.name.toLowerCase().indexOf(searchTerms.search_str) !== -1
        || data.code.toString().toLowerCase().indexOf(searchTerms.search_str) !== -1)
        && data.language.indexOf(searchTerms.language) !== -1
    }
    return filterFunction;
    }

  ngOnDestroy() {

  }

  CreateBank() {
    let dialogRef = this.dialog.open(CreateBankDialogComponent, {
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

  UpdateBank(bank) {
    let dialogRef = this.dialog.open(UpdateBankDialogComponent, {
      width: '40%',
      minWidth: '500px',
      data: bank
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {

      }
    });
  }

  DeleteBank(bank){
    const dialogRef = this.dialog.open(DeleteBankDialogComponent, {
      width: '30%',
      minWidth: '500px',
      data: bank
    });

  }

  getListBank() {
    let list = this.dataService.listBank.getValue();
    if (list) {
      this.listBank.data = list;
    } else {
      this.userApiService.listBank({}).then(data => {});
    }
  }

  ngAfterViewInit() {
    this.listBank.paginator = this.paginator
}

  resetForm($event, formControl: AbstractControl, needReset) {
    if (!needReset) {
      return;
    }
    formControl.setValue('');
    $event.stopPropagation();
  }

}
