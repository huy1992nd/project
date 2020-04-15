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
  public subFavorites:any;
  public listFavorites:any =[];
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
  public currentUser: any;
  public currentMode: any;
  public currentPage: any;
  public currentSearch: any;
  ngOnInit() {
    this.currentMode = this.dataService.currentMode.getValue();   
    this.currentUser = this.dataService.currentUser.getValue();
    this.initSub();
    this.form = new FormGroup({
      search: new FormControl(this.search, []),
      page: new FormControl("1", []),
    });

    this.getListFavorites();
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
  }

  getListFavorites() {
    let list = this.dataService.listFavorites.getValue();
    if (list &&  list[this.currentUser.account_id]) {
      this.listFavorites = list[this.currentUser.account_id];
    } else {
      this.userApiService.listFavorites({account_id:this.currentUser.account_id}).then(data => {});
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
  }


}
