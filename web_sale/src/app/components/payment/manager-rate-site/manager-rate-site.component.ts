import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiService } from './../../../services/api.service';
import { DataService } from './../../../services/data.service';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { CreateRateSiteDialogComponent } from './create-rate-site-dialog/create-rate-site-dialog.component';
import { DeleteRateSiteDialogComponent } from './delete-rate-site-dialog/delete-rate-site-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-manager-rate-site',
  templateUrl: './manager-rate-site.component.html',
  styleUrls: ['./manager-rate-site.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManagerRateSiteComponent implements OnInit {

  public searchForm: FormGroup;
  listRate: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  currentUser: any;
  expandedElement: any;
  myProductList: any;
  ctvProductList: any = [];
  listSite: any = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['number', 'currencies', 'rate', 'site', 'type', 'action'];
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
  }
  ngOnInit() {
    this.listRate.filterPredicate = this.tableFilter();
    this.searchForm = new FormGroup({
      search_str: new FormControl(),
      site: new FormControl(),
    });

    this.currentUser = this.dataService.currentUser.getValue();

    this.myProductList = [];
    this.listRate.data = [];
    this.getListRate();
    this.searchForm.valueChanges.subscribe(v => {
      var criteria = {
        search_str: v.search_str ? v.search_str.toLowerCase() : ""
      };
      this.listRate.filterPredicate = this.tableFilter();
      this.applyFilter(JSON.stringify(criteria));
    });
    this.dataService.listRateSite.subscribe(data=>{
      if(!data)
          return;
          this.listRate.data = this.dataService.listRateSite.getValue();
    })
  }

  async InitData() {
    return new Promise(resolve => {
      resolve();
    })
  }

  applyFilter(filter: string) {
    this.listRate.filter = filter;
  }

  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.left.toLowerCase().indexOf(searchTerms.search_str) !== -1
        || data.right.toString().toLowerCase().indexOf(searchTerms.search_str) !== -1
    }
    return filterFunction;
    }

  ngOnDestroy() {

  }

  CreateRatesite() {
    let dialogRef = this.dialog.open(CreateRateSiteDialogComponent, {
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

  deleteRatesite(user){
    const dialogRef = this.dialog.open(DeleteRateSiteDialogComponent, {
      width: '30%',
      minWidth: '500px',
      data: user
    });

  }

  getListRate() {
    let list = this.dataService.listRateSite.getValue();
    if (list) {
      this.listRate.data = list;
    } else {
      this.apiService.listRateSite({
        site:document.location.hostname
      }).then(data => {});
    }
  }
  ngAfterViewInit() {
    this.listRate.paginator = this.paginator
}

  resetForm($event, formControl: AbstractControl, needReset) {
    if (!needReset) {
      return;
    }
    formControl.setValue('');
    $event.stopPropagation();
  }

}
