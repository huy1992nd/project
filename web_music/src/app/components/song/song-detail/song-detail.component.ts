import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './../../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {historyView} from '../../../models/history_view.model';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {
  @ViewChild('control_video', { static: false }) control_video: ElementRef;
  history_infor = new historyView();
  public currentUser: any;
  public subSong: any;
  public first_load = true;
  public is_load = false;
  id_song: any;
  current_song: any;
  page: any;
  public config: PerfectScrollbarConfigInterface = {
    wheelSpeed : 0.5,               // Scroll speed for the mousewheel event (Default: 1)
    swipeEasing : true,           // Use easing for the swipe scrolling (Default: true).
    suppressScrollX : true,       // Disable X axis in all situations (Default: false).
    suppressScrollY : false,      // Disable Y axis in all situations (Default: false).
    wheelPropagation : true,      // Propagate wheel events at the end (Default: false).
    useBothWheelAxes : true,      // Always use both of the wheel axes (Default: false).
    minScrollbarLength : 50,      // Minimum size (px) for the scrollbar (Default: null).
    maxScrollbarLength : 150,      // Maximum size (px) for the scrollbar (Default: null).
    scrollXMarginOffset : 0,      // Offset before enabling the X scroller (Default: 0).
    scrollYMarginOffset : 0,      // Offset before enabling the Y scroller (Default: 0).
  };
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    public router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private e: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.currentUser = this.dataService.currentUser.getValue();
    // this.id_song = this.route.snapshot.params.id;
    // this.page = this.route.snapshot.queryParams.page;
    // this.getSong();
    this.initSub();
  }
  
  initSub() {
    this.route.params
      .subscribe((value) => {
        this.id_song = this.route.snapshot.params.id;
        this.page = this.route.snapshot.queryParams.page;
        
        this.getSong();
        this.updateHistoryInfor();
      });
    this.subSong = this.dataService.listSongDetail.subscribe(data => {
      if (!data) {
        this.current_song = "none";
        return;
      } else {
        this.current_song = data[this.id_song] || null;
        this.updateView();
      }
    });
  }

  updateHistoryInfor(){
    let h_infor = this.dataService.listHistory.getValue();
    if(h_infor){
      this.history_infor = h_infor;
      if(this.history_infor.status == "new"){
        this.history_infor.listIdSong.push(parseInt(this.id_song));
        this.history_infor.current_index = 0;
      }else{
        this.history_infor.status = 'new';
      }
    }else{
      this.history_infor.listIdSong = [parseInt(this.id_song)];
    }
    this.dataService.listHistory.next(this.history_infor);
  }

  clickNext(){
    if(this.is_load == false){
      this.is_load = true;
      this.history_infor.status = 'next';
      var id_song = 0;
      if(this.history_infor.current_index){
        let start_index = this.history_infor.listIdSong.length - this.history_infor.current_index;
        let end_index = start_index + 1;;
        id_song = this.history_infor.listIdSong.slice(start_index, end_index)[0];
        this.history_infor.current_index--;
      }else{
        id_song = this.ranDomSong();
        this.history_infor.listIdSong.push(id_song);
      }
      this.dataService.listHistory.next(this.history_infor);
      this.router.navigate(['/detail', id_song]);
    }
  }

  clickPrev(){
    if(this.is_load == false){
      this.is_load = true;
      this.history_infor.status = 'prev';
      var id_song = 0;
      if(this.history_infor.current_index+1 < this.history_infor.listIdSong.length ){
        let end_index = this.history_infor.listIdSong.length - (this.history_infor.current_index+1);
        let start_index = end_index - 1;
        id_song = this.history_infor.listIdSong.slice(start_index, end_index)[0];
        this.history_infor.current_index++;
      }else{
        this.history_infor.current_index++;
        id_song = this.ranDomSong();
        this.history_infor.listIdSong.unshift(id_song);
      }
      this.dataService.listHistory.next(this.history_infor);
      this.router.navigate(['/detail', id_song]);
    }
  }

  over() {
    this.renderer.removeClass(this.control_video.nativeElement, "hide-control");
  }

  out() {
    this.renderer.addClass(this.control_video.nativeElement, "hide-control");
  }

  convertURL(url: String) {
    if (url) {
      let url_return = url.replace("autoplay=1", "autoplay=0");
      return this.sanitizer.bypassSecurityTrustResourceUrl(url_return);
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl("");
    }
  }

  getSong() {
    let list_detail = this.dataService.listSongDetail.getValue();
    if (list_detail && list_detail[this.id_song]) {
      this.current_song = list_detail[this.id_song];
    } else {
      var listSongInPage = this.dataService.listSong.getValue();
      let current_song = this.findInListPage(listSongInPage);
      if (current_song) {
        list_detail = list_detail || {};
        list_detail[this.id_song] = current_song;
        this.dataService.listSongDetail.next(list_detail);
      } else {
        this.apiService.listSongDetail({ id_song: this.id_song }).then(data => { });
      }
    }
    this.updateView();
  }

  updateView() {
    this.is_load = false;
    if (this.current_song && this.first_load) {
      this.apiService.updateView({ _id: this.current_song._id }).then(data => {
        this.first_load = false;
      });
    }
  }

  findInListPage(listSongInPage) {
    try {
      if (this.page && listSongInPage && listSongInPage[this.page] && listSongInPage[this.page].find(item => item.song_id == this.id_song)) {
        return listSongInPage[this.page].find(item => item.song_id == this.id_song)
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }

  }

  ranDomSong(){
    return Math.floor(Math.random() * 500) + 1  
  }

  ngOnDestroy() {
    this.subSong.unsubscribe();
  }

}
