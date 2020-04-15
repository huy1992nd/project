import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './../../../../services/data.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-like-song',
  templateUrl: './like-song.component.html',
  styleUrls: ['./like-song.component.css']
})

export class LikeSongComponent implements OnInit {
  @Input() id_song: any;
  public like:Boolean = false;
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
  ) { }
  public currentUser:any;
  public subLike:any;
  ngOnInit() {
    this.currentUser = this.dataService.currentUser.getValue();
    this.subLike = this.dataService.listLike.subscribe(data=>{
      if(!data)
          return;
      if(data[this.currentUser.account_id]){
        this.like = data[this.currentUser.account_id][this.id_song] || false;
      }
    });

    this.getListLike();
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
      this.apiService.listFavorites({account_id:this.currentUser.account_id}).then(data => {});
    });
  }


  getListLike() {
    let list = this.dataService.listLike.getValue();
    if (list && list[this.currentUser.account_id]) {
      this.like = list[this.currentUser.account_id][this.id_song] || false;
    } else {
      this.apiService.listLike({account_id:this.currentUser.account_id, type : this.currentUser.login_type}).then(data => {});
    }
  }

  ngOnDestroy() {
    this.subLike.unsubscribe();
  }

}
