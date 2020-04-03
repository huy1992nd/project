import { Component, OnInit } from '@angular/core';
import { LazyLoadScriptService } from './../../common/lazyLoadScript';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  constructor(
    private lazyLoadService: LazyLoadScriptService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  Logout() {
		localStorage.removeItem('session');
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
    this.lazyLoadService.loadScript('./assets/theme/js/common-scripts.js').subscribe(_ => { console.log('common-scripts is load') });
    this.lazyLoadService.loadScript('./assets/theme/js/gritter.js').subscribe(_ => { });
	}

}
