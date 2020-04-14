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
  public subLike:any;
  public subCurrentPage:any;
  public subCurrentSearch:any;
  public page:number = 1;
  public search:any = "";
  public listSong:any [];
  public listLike:any [];
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
        this.getListLike();
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
    this.subLike = this.dataService.listLike.subscribe(data=>{
      if(!data)
          return;
      if(data[this.currentUser.account_id]){
        this.listLike = data[this.currentUser.account_id];
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

  getListLike() {
    let list = this.dataService.listLike.getValue();
    if (list && list[this.currentUser.account_id]) {
      this.listLike = list[this.currentUser.account_id];
    } else {
      this.apiService.listLike({account_id:this.currentUser.account_id, type : this.currentUser.login_type}).then(data => {});
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

  updateLike(song_id){
    let status = this.listLike[song_id]? false : true
    this.apiService.updateLike({
      account_id:this.currentUser.account_id,
      song_id: song_id,
      status: status,
    }).then(data => {
      let list = this.dataService.listLike.getValue();
      list[this.currentUser.account_id][song_id] = status;
      this.dataService.listSong.next(list);
    });
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
    this.subLike.unsubscribe();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

}
