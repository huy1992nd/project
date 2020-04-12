import { Component, OnInit } from '@angular/core';
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
  public subSong:any;
  id_song: any ;
  current_song: any ;
  page: any ;
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    public router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.id_song = this.route.snapshot.params.id;
    this.page = this.route.snapshot.queryParams.page;
    this.subSong = this.dataService.listSongDetail.subscribe(data=>{
      if(!data){
        this.current_song ="none"
        return;
      }else{
        this.current_song = data[this.id_song] || null;
      }
    });
    this.getSong();
  }

  getSong() {
    let list_detail = this.dataService.listSongDetail.getValue();
    if (list_detail && list_detail[this.id_song]) {
      this.current_song = list_detail[this.id_song];
    } else {
      var listSongInPage =  this.dataService.listSong.getValue();
      let current_song = this.findInListPage(listSongInPage);
      if(current_song){
          list_detail = list_detail || {};
          list_detail[this.id_song] = current_song;
          this.dataService.listSongDetail.next(list_detail);
      }else{
        this.apiService.listSongDetail({id_song:this.id_song}).then(data => {});
      }
    }
  }

  findInListPage(listSongInPage){
       if(this.page && listSongInPage){
           return listSongInPage[this.page] ? listSongInPage[this.page].find(item=>item.song_id == this.id_song) : null;
       }else{
         return null;
       }
  }

  ngOnDestroy() {
    this.subSong.unsubscribe();
  }

}
