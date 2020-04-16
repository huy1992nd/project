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

    // this.getListLike();
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

  ngOnChanges() {
    let listLike = this.dataService.listLike.getValue();
    if(listLike && this.currentUser && this.id_song){
      this.like = listLike[this.currentUser.account_id][this.id_song] || false;
    }
  }

  ngOnDestroy() {
    this.subLike.unsubscribe();
  }

}
