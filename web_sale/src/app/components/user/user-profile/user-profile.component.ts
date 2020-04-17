import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from './../../../services/data.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public userProfile: any;
  public currentUser: any;
  constructor(
    private apiService : ApiService,
    private dataService : DataService,
  ) { }

  ngOnInit() {
    this.currentUser = this.dataService.currentUser.getValue();
    this.apiService.getUserProfile({login_type:this.currentUser.login_type}).then(data => {
      if(data){
        this.userProfile = data.data;
      }
    });
  }

}
