import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './../../../services/data.service';
@Component({
  selector: 'app-favorites-song',
  templateUrl: './favorites-song.component.html',
  styleUrls: ['./favorites-song.component.css']
})
export class FavoritesSongComponent implements OnInit {
  public sub:any;
  public listFavorites:any;
  public currentUser:any;
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.currentUser = this.dataService.currentUser.getValue();
    this.dataService.currentMode.next('favorites');
    this.sub = this.dataService.listFavorites.subscribe(data=>{
      if(!data)
          return;
      if(data[this.currentUser.account_id] ){
        this.listFavorites = data[this.currentUser.account_id];
      }
    });

    this.getListFavoritesSong();
  }

  getListFavoritesSong() {
    let list = this.dataService.listFavorites.getValue();
    if (list && list[this.currentUser.account_id] ) {
      this.listFavorites = list[this.currentUser.account_id];
    } else {
      this.apiService.listFavorites({account_id:this.currentUser.account_id}).then(data => {});
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
