import { Component, OnInit } from '@angular/core';
import { LazyLoadScriptService } from './../../common/lazyLoadScript';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { DataService } from './../../services/data.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {
  loading = false;
  constructor(
    private lazyLoadService: LazyLoadScriptService,
    private apiService: ApiService,
    private dataService: DataService,
    private router: Router,
  ) { 
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart:
        case event instanceof NavigationStart:
          console.log('vao start')
          this.loading = true;
          break;
        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
          console.log('vao not start')
          this.loading = false;
          break;
      
        default:
          break;
      }
});
  }
  public currentUser:any;
  ngOnInit() {
    this.currentUser = this.dataService.currentUser.getValue();
    this.getListLike();
  }

  getListLike() {
    let list = this.dataService.listLike.getValue();
    if (list && list[this.currentUser.account_id]) {
    } else {
      this.apiService.listLike({account_id:this.currentUser.account_id, type : this.currentUser.login_type}).then(data => {});
    }
  }

  ngAfterViewInit() {
		// this.lazyLoadService.loadScript('./assets/theme/js/jquery.js').subscribe(_ => { });
		// this.lazyLoadService.loadScript('./assets/theme/js/bootstrap.min.js').subscribe(_ => { });
		// this.lazyLoadService.loadScript('./assets/theme/js/jquery.dcjqaccordion.2.7.js').subscribe(_ => { });
		// this.lazyLoadService.loadScript('./assets/theme/js/jquery.scrollTo.min.js').subscribe(_ => { });
		// this.lazyLoadService.loadScript('./assets/theme/js/jquery.nicescroll.js').subscribe(_ => { console.log('common-scripts is load') });
    // this.lazyLoadService.loadScript('./assets/theme/assets/gritter/js/jquery.gritter.js').subscribe(_ => { });
    // this.lazyLoadService.loadScript('./assets/theme/js/respond.min.js').subscribe(_ => { });
    // this.lazyLoadService.loadScript('./assets/theme/js/common-scripts.js').subscribe(_ => {  });
    this.lazyLoadService.loadScript('./assets/theme/js/gritter.js').subscribe(_ => { });
  }

}
