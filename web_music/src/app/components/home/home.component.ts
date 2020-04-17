import { Component, OnInit, ElementRef, ViewChild, Inject, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './../../services/data.service';
import { LazyLoadScriptService } from './../../common/lazyLoadScript';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { trigger, state, style, transition, animate, query } from '@angular/animations';
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	animations: [
		trigger('detailExpand', [
			state('hiden', style({ height: '0px', opacity: 0 })),
			state('show', style({ height: "*", opacity: 1 })),
			transition('hiden  => show', [animate('250ms', style({ height: '*', opacity: 1 }))]),
			transition('show  => hiden', [animate('250ms', style({ height: '0px', opacity: 0 }))]),
		]),
	]
})

export class HomeComponent implements OnInit {

	@ViewChild('.filemenu', { static: false }) menu: ElementRef;
	private menuShow: Boolean = false;
	constructor(
		private renderer: Renderer2,
		@Inject(DOCUMENT) private document: Document,
		public translate: TranslateService,
		private dataService: DataService,
		private lazyLoadService: LazyLoadScriptService,
		private elRef: ElementRef,
		public router: Router) {
		this.routeEvent(this.router);
	}

	isCms: Number;
	currentLang: string;
	currentUser: any;
	show_menu: any = {};
	ngOnInit() {
		this.currentLang = this.dataService.currentLanguage.getValue();
		this.currentUser = this.dataService.currentUser.getValue();
	}

	getShowMenu() {
		let menu = "";
		let current_url = this.router.url;
		if (current_url == '/user') {
			menu = 'mn_1';
		}
		else if (current_url == '/customer' || current_url == '/list-role' ) {
			menu = 'mn_2';
		}
		else if (current_url == '/list-permission') {
			menu = 'mn_3';
		}
		else if (current_url == '/list-bank' 
		|| current_url == '/list-account-site' 
		|| current_url == '/list-rate-site' 
		|| current_url == '/list-fee-site' 
		) {
			menu = 'mn_4';
		}
		else if (current_url.includes('cms/post') || current_url.includes('taxonomy')) {
			menu = 'mn_5';
		}
		else if (current_url.includes( '/cms/page') ) {
			menu = 'mn_6';
		}
		setTimeout((menu)=>{
			this.show_menu[menu] = true;
		},1,menu);
	}

	/**
	 * 
	 * @param router 
	 */
	routeEvent(router: Router) {
		router.events.subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.isCms = this.CheckCMSRoute(e.url);
			}
		});
	}

	/**
	 * Check current route for CMS to toggle Menu
	 * @param route 
	 */
	CheckCMSRoute(url) {
		var n = url.indexOf('cms');
		return n;
	}

	ChangeCurrentlang(lang) {
		this.currentLang = lang;
		this.dataService.UpdateLanguage(lang);
	}

	ngAfterViewInit() {
		console.log('vvvvv');
		this.lazyLoadService.loadScript('./assets/js/adminux.js').subscribe(_ => { });
		this.getShowMenu();
	}
	Logout() {
		localStorage.removeItem('session');
		localStorage.removeItem('session_facebook');
		localStorage.removeItem('session_google');
		this.router.navigate(['/login']);
	}

	menuClick() {
		this.menuShow = !this.menuShow;
		if (this.menuShow) {
			this.document.body.classList.add('menuclose');
		} else {
			this.document.body.classList.remove('menuclose');
		}
	}

	toggleClass(event: any, class_name: string, menu_type) {
		let className = event.target.className;
		console.log(className);
		if (className.includes("menudropdown")) {
			const hasClass = event.target.classList.contains(class_name);
			if (hasClass) {
				this.show_menu[menu_type] = false;
				this.renderer.removeClass(event.target, class_name);
				if (event.currentTarget.children[1]) {
					this.renderer.setStyle(event.currentTarget.children[1], 'height', '0px');
					this.renderer.setStyle(event.currentTarget.children[1], 'display', 'block');
				}
			} else {
				this.show_menu[menu_type] = true;
				this.renderer.addClass(event.target, class_name);
				if (event.currentTarget.children[1]) {
					this.renderer.setStyle(event.currentTarget.children[1], 'height', '*');
					this.renderer.setStyle(event.currentTarget.children[1], 'display', 'block');
				}
			}
		}
	}


}
