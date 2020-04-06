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
  public subListSong:any;
  public subPageSong:any;
  public page:any = 1;
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
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.page = +params['page'] || 1;
        this.getListPageSong();
        this.getListSong(this.page);
      });
      this.subListSong = this.dataService.listSong.subscribe(data=>{
        if(!data)
            return;
            this.listSong = data[this.page];
            console.log('list song',this.listSong);
      });
      this.subPageSong = this.dataService.listPageSong.subscribe(data=>{
        if(!data)
            return;
            this.listPageSong = data;
            this.paginate();
      });
  }

  getListSong(page: any) {
    let list = this.dataService.listSong.getValue();
    if (list && list[page]) {
      this.listSong = list[page];
    } else {
      this.apiService.listSong({page:this.page}).then(data => {});
    }
  }

  getListPageSong() {
    let list = this.dataService.listPageSong.getValue();
    if (list ) {
      this.listPageSong = list;
    } else {
      this.apiService.listPageSong({}).then(data => {});
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
