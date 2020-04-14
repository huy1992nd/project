import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './../../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer  } from '@angular/platform-browser';
@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.css']
})
export class SongDetailComponent implements OnInit {
  public currentUser:any;
  public subSong:any;
  public subLike:any;
  public like:any [];
  public first_load = true;
  id_song: any ;
  current_song: any ;
  page: any ;
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    public router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    
    this.currentUser = this.dataService.currentUser.getValue();
    this.id_song = this.route.snapshot.params.id;
    this.page = this.route.snapshot.queryParams.page;
    this.getSong();
    this.getListLike();
    this.initSub();
  }

  initSub(){
    this.subSong = this.dataService.listSongDetail.subscribe(data=>{
      if(!data){
        this.current_song ="none";
        return;
      }else{
        this.current_song = data[this.id_song] || null;
        this.updateView();
      }
    });
    this.subLike = this.dataService.listLike.subscribe(data=>{
      if(!data)
          return;
      if(data[this.currentUser.account_id]){
        this.like = data[this.currentUser.account_id][this.id_song] || false;
      }
    });
  }

  convertURL(url:String) {
    if(url){
      let url_return = url.replace("autoplay=1","autoplay=0");
      return this.sanitizer.bypassSecurityTrustResourceUrl(url_return);
    }else{
      return this.sanitizer.bypassSecurityTrustResourceUrl("");
    }
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
    this.updateView();
  }

  updateView(){
    if(this.current_song && this.first_load){
      this.apiService.updateView({_id:this.current_song._id}).then(data => {
        this.first_load = false;
      });
    }
  }
  getListLike() {
    let list = this.dataService.listLike.getValue();
    if (list && list[this.currentUser.account_id]) {
      this.like = list[this.currentUser.account_id][this.id_song] || false;
    } else {
      this.apiService.listLike({account_id:this.currentUser.account_id, type : this.currentUser.login_type}).then(data => {});
    }
  }

  updateLike(){
    let status = this.like? false : true;
    this.apiService.updateLike({
      account_id:this.currentUser.account_id,
      song_id: this.id_song,
      status: status,
    }).then(data => {
      let list = this.dataService.listLike.getValue();
      list[this.currentUser.account_id][this.id_song] = status;
      this.dataService.listLike.next(list);
    });
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
    this.subLike.unsubscribe();
  }

}
