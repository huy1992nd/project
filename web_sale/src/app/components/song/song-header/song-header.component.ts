import {  Component, OnInit, Renderer2, ElementRef, ViewChild} from '@angular/core';
import { DataService } from './../../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-song-header',
  templateUrl: './song-header.component.html',
  styleUrls: ['./song-header.component.css']
})
export class SongHeaderComponent implements OnInit {
  @ViewChild('searchbt', {static: false}) btsearch:ElementRef ;
  @ViewChild('searchip', {static: false}) ipsearch:ElementRef ;
  public sub:any;
  public subMode:any;
  public subView:any;
  public subFavorites:any;
  public listFavorites:any =[];
  public listViews:any =[];
  public page:any = 1;
  public search:any = "";
  form: FormGroup;
  constructor(
    private dataService: DataService,
    public translate: TranslateService,
    public userApiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private e: ElementRef,
    private renderer: Renderer2
  ) { }
  public currentMode: any;
  public currentUser: any;
  public max_view: number = 100;
  public currentPage: any;
  public currentSearch: any;
  public listNotyfication: any = [
    {"type":"1","message": "Có 10 bài hát mới được cập nhật", "time":"50 mins"},
    {"type":"2","message": "You are in the world", "time": "1 Hour"},
  ];

  ngOnInit() {
    this.currentMode = this.dataService.currentMode.getValue();   
    this.currentUser = this.dataService.currentUser.getValue();
    this.initSub();
    this.form = new FormGroup({
      search: new FormControl(this.search, []),
      page: new FormControl("1", []),
    });

    this.getListFavorites();
    this.getView();
  }

  initSub(){
    this.subMode = this.dataService.currentMode.subscribe(data=>{
      if(!data)
          return;
      this.currentMode = data;
    });
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.page = +params['page'] || 1;
        this.search = params['search'] || "";
      });
    this.subFavorites = this.dataService.listFavorites.subscribe(data=>{
      if(!data)
          return;
      if(data[this.currentUser.account_id]){
        this.listFavorites = data[this.currentUser.account_id];
        
      }
    });
    this.subView = this.dataService.topView.subscribe(data=>{
      if(!data)
          return;
      this.listViews = data;
      this.max_view = this.listViews[0].view || 100;
    });
  }

  getListFavorites() {
    let list = this.dataService.listFavorites.getValue();
    if (list &&  list[this.currentUser.account_id]) {
      this.listFavorites = list[this.currentUser.account_id];
    } else {
      this.userApiService.listFavorites({account_id:this.currentUser.account_id}).then(data => {});
    }
  }

  getView() {
    let list = this.dataService.topView.getValue();
    if (list) {
      this.listViews = list;
    } else {
      this.userApiService.topView({}).then(data => {});
    }
  }

  getPercent(i){
    let v = i? parseInt(i): 0;
    return Math.floor(v*100/this.max_view);
  }

  convertM(m){
    if(m && m.length > 25){
      return m.slice(0,23)+"...";
    }else{
      return m;
    }
  }

  changeMode(){
    if(this.currentMode == 'favorites'){
      this.currentMode = '';
      this.dataService.currentMode.next(this.currentMode);
      this.router.navigate(['../'], { });
    }else{
      this.currentMode = 'favorites';
      this.dataService.currentMode.next(this.currentMode);
      this.router.navigate(['/favorites'], { });
    }

  }
  clickHeader(e){
    if (e.target && e.target.classList && e.target.classList[0] == 'header'){
      this.renderer.removeClass(this.ipsearch.nativeElement,"search-select");
    }
  }

  removeSearch(){
    this.renderer.removeClass(this.ipsearch.nativeElement,"search-select");
  }

  submit(){
    if(!this.ipsearch.nativeElement.classList.contains('search-select')){
       this.renderer.addClass(this.ipsearch.nativeElement,"search-select");
       this.ipsearch.nativeElement.focus();
    }else{
      this.router.navigate(['../'], { queryParams: this.form.value });
      if (this.form.valid) {
      }
    }
  }

  Logout() {
		localStorage.removeItem('session');
		localStorage.removeItem('session_facebook');
		localStorage.removeItem('session_google');
		this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subMode.unsubscribe();
    this.subFavorites.unsubscribe();
    this.subView.unsubscribe();
  }
}


