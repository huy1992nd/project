import { Component, OnInit } from '@angular/core';
import { LazyLoadScriptService } from './../../common/lazyLoadScript';
import { Router } from '@angular/router';
import { DataService } from './../../services/data.service';
@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  public subSong:any;
  public currentUser:any;
  constructor(
    private lazyLoadService: LazyLoadScriptService,
    private dataService: DataService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.currentUser = this.dataService.currentUser.getValue();
  }

  Logout() {
		localStorage.removeItem('session');
		localStorage.removeItem('session_face');
		this.router.navigate(['/login']);
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
