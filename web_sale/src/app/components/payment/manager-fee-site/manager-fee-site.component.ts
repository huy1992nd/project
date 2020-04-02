import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApiService } from './../../../services/api.service';
import { DataService } from './../../../services/data.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-manager-fee-site',
  templateUrl: './manager-fee-site.component.html',
  styleUrls: ['./manager-fee-site.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManagerFeeSiteComponent implements OnInit {

  public searchForm: FormGroup;
  listData: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  currentUser: any;
  expandedElement: any;
  myProductList: any;
  ctvProductList: any = [];
  listSite: any = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['number', 'site', 'type', 'fee', 'promotion_id', 'description'];
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ) {
  }
  ngOnInit() {
    this.listData.filterPredicate = this.tableFilter();
    this.searchForm = new FormGroup({
      search_str: new FormControl(),
      site: new FormControl(),
    });

    this.currentUser = this.dataService.currentUser.getValue();

    this.myProductList = [];
    this.listData.data = [];
    this.getListData();
    this.searchForm.valueChanges.subscribe(v => {
      var criteria = {
        search_str: v.search_str ? v.search_str : "",
        site: v.site? v.site : ""
      };
      this.listData.filterPredicate = this.tableFilter();
      this.applyFilter(JSON.stringify(criteria));
    });
    this.dataService.listFee.subscribe(data=>{
      if(!data)
          return;
          this.listData.data = this.dataService.listFee.getValue();
          this.listSite = [...new Set(this.dataService.listFee.getValue().map(item => item.site))];
    })
  }

  async InitData() {
    return new Promise(resolve => {
      resolve();
    })
  }

  applyFilter(filter: string) {
    this.listData.filter = filter;
  }

  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return (data.type.toLowerCase().indexOf(searchTerms.search_str) !== -1
      && data.site.indexOf(searchTerms.site) !== -1)
    }
    return filterFunction;
    }

  ngOnDestroy() {

  }


  getListData() {
    let list = this.dataService.listFee.getValue();
    if (list) {
      this.listData.data = list;
    } else {
      this.apiService.listFee({
        site:document.location.hostname
      }).then(data => {});
    }
  }
  
  ngAfterViewInit() {
    this.listData.paginator = this.paginator
}

  resetForm($event, formControl: AbstractControl, needReset) {
    if (!needReset) {
      return;
    }
    formControl.setValue('');
    $event.stopPropagation();
  }

}

