import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './../../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {
  @ViewChild('control_video', { static: false }) control_video: ElementRef;
  public currentUser: any;
  public subSong: any;
  public first_load = true;
  id_song: any;
  prev_song: any;
  next_song: any;
  current_song: any;
  page: any;
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
    this.id_song = this.route.snapshot.params.id;
    this.page = this.route.snapshot.queryParams.page;
    this.getSong();
    this.initSub();
  }

  over() {
    this.renderer.removeClass(this.control_video.nativeElement, "hide-control");
  }

  out() {
    this.renderer.addClass(this.control_video.nativeElement, "hide-control");
  }

  initSub() {
    this.route.params
      .subscribe((value) => {
        this.id_song = this.route.snapshot.params.id;
        this.page = this.route.snapshot.queryParams.page;
        this.getSong();
      });
    this.subSong = this.dataService.listSongDetail.subscribe(data => {
      if (!data) {
        this.current_song = "none";
        return;
      } else {
        this.current_song = data[this.id_song] || null;
        this.next_song = this.ranDomSong()
        this.prev_song = this.ranDomSong()
        this.updateView();
      }
    });
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
    if (this.current_song && this.first_load) {
      this.apiService.updateView({ _id: this.current_song._id }).then(data => {
        this.first_load = false;
      });
    }
  }

  findInListPage(listSongInPage) {
    try {
      if (this.page && listSongInPage && listSongInPage[this.page] && listSongInPage[this.page].find(item => item.song_id == this.id_song)) {
        let current_pos = listSongInPage[this.page].map(function(e) { return e.song_id; }).indexOf(this.id_song);
          this.next_song = listSongInPage[this.page][current_pos+1]?listSongInPage[this.page][current_pos+1].song_id : this.ranDomSong();
          this.prev_song = listSongInPage[this.page][current_pos-1]?listSongInPage[this.page][current_pos-1].song_id : this.ranDomSong();
        return listSongInPage[this.page].find(item => item.song_id == this.id_song)
      } else {
        this.next_song = this.ranDomSong();
        this.prev_song = this.ranDomSong();
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
