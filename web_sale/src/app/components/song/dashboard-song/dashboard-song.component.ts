import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './../../../services/data.service';
import  {PageTable} from '../../../common/pageTable';

@Component({
  selector: 'app-dashboard-song',
  templateUrl: './dashboard-song.component.html',
  styleUrls: ['./dashboard-song.component.css']
})
export class DashboardSongComponent implements OnInit {
  public sub:any;
  public currentUser:any;
  public subListSong:any;
  public subPageSong:any;
  public subView:any;
  public subCurrentPage:any;
  public subCurrentSearch:any;
  public page:number = 1;
  public search:any = "";
  public listSong:any [];
  public listPageSong:any [];
  public  pageTable = new  PageTable();
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.currentUser = this.dataService.currentUser.getValue();
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.page = +params['page'] || 1;
        this.search = params['search'] || "";
        this.getListPageSong();
        this.getListSong();
      });
      this.initSub();
  }

  initSub(){
    this.subListSong = this.dataService.listSong.subscribe(data=>{
      if(!data)
          return;
      if(data[this.search] && data[this.search][this.page]){
        this.listSong = data[this.search][this.page];
      }
    });

    this.subPageSong = this.dataService.listPageSong.subscribe(data=>{
      if(!data)
          return;
      if(data[this.search]){
        this.listPageSong = data[this.search];
        this.paginate();
      }
    });
  }

  getListSong() {
    let list = this.dataService.listSong.getValue();
    if (list && list[this.search] && list[this.search][this.page]) {
      this.listSong = list[this.search][this.page];
    } else {
      this.apiService.listSong({page:this.page, search: this.search}).then(data => {});
    }
  }

  getListPageSong() {
    let list = this.dataService.listPageSong.getValue();
    if (list && list[this.search] ) {
      this.listPageSong = list[this.search];
      this.paginate();
    } else {
      this.apiService.listPageSong({search:this.search}).then(data => {
        search: this.search
      });
    }
  }

  paginate(){
    this.pageTable.currentPage = this.page-1;
    this.pageTable.itemsPerPage= 1;
    this.pageTable.items = this.listPageSong;
    this.pageTable.groupToPages();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subListSong.unsubscribe();
    this.subPageSong.unsubscribe();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

}
