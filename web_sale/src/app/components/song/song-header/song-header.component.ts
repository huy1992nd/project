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
  public currentPage: any;
  public currentSearch: any;
  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.page = +params['page'] || 1;
        this.search = params['search'] || "";
      });

    this.currentUser = this.dataService.currentUser.getValue();
    this.form = new FormGroup({
      search: new FormControl(this.search, []),
      page: new FormControl("1", []),
    });
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
  }


}
