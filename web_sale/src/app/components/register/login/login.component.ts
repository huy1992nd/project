import { Component, OnInit, ViewChild, Inject, forwardRef } from '@angular/core';
declare var FB: any;
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ApiService } from 'src/app/services/api.service';
// import { SocialService } from 'src/app/services/social.service';
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  radicalValue;
  mousePositionX;
  mousePositionY;
  returnUrl: string;
  showPassword: Boolean = false;
  form: FormGroup;
  public isLoading : boolean = false;
  public errorMessage: string = '';
  account_validation_messages = {
    'account_id': [
      { type: 'required', message: 'Account_id không được để trống' },
      { type: 'minlength', message: 'Account id không được dưới 6 kí tự' },
      {type:'pattern', message:'Account id không được có dấu cách'}
    ],
    'password': [
      { type: 'required', message: 'Password không được để trống' },
      { type: 'minlength', message: 'Password không được dưới 6 kí tự' }
    ]
    };
  constructor(
    public translate: TranslateService,
    public userApiService: ApiService,
    // public socialService: SocialService,
    private router: Router,
    private route: ActivatedRoute,
    // private sanitizer: DomSanitizer,
    public notify: NotifyService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService
  ) {
   }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
   // this.radicalValue = this.sanitizer.bypassSecurityTrustStyle("background: radial-gradient(circle at center center ,#e5e5be, #003973);");
    this.form = new FormGroup({
      account_id: new FormControl('root_localhost', [Validators.required,Validators.minLength(6),Validators.pattern("[^' ']+")]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6)]),
      remember_account: new FormControl(false)
    });

    this.authService.authState.subscribe((user) => {
      if(user){
        console.log("user", user);
        localStorage.setItem('session_face', user.authToken);
        this.userApiService.initApp(user).then(() => {
          this.notify.success('Đăng nhập thành công');
          // this.redirectTo(this.returnUrl);
          // window.location.assign(this.returnUrl)
          this.router.navigateByUrl(this.returnUrl);
        });
      }
    });

  }

  
  
  onMouseMove(e) {
    //this.radicalValue = this.sanitizer.bypassSecurityTrustStyle(`background: radial-gradient(circle at ${e.pageX}px ${e.pageY}px ,#e5e5be, #003973);`)
  }

  submitLogin(){
    console.log("submit login to facebook");
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    // FB.login();
    // this.socialService.loginFaceBook((response)=>
    //     {
    //       console.log('submitLogin',response);
    //       if (response.authResponse)
    //        {
    //           console.log('token is',response.authResponse);
    //           localStorage.setItem('session_face', response.authResponse);
    //           this.userApiService.initApp(response.authResponse).then(() => {
    //           this.notify.success('Đăng nhập thành công');
    //           // this.redirectTo(this.returnUrl);
    //           window.location.assign(this.returnUrl)
    //           // this.router.navigateByUrl(this.returnUrl);
    //           });
    //        }
    //        else
    //        {
    //        console.log('User login failed');
    //      }
    //   });

  }

  submit(){
    if (this.form.valid) {
      this.isLoading =true;
      this.userApiService.login(this.form.value)
        .then(data => {
          this.isLoading =false;
          if (data.result_code == 0) {
              console.log('token is',data.token_authen);
              localStorage.setItem('session', data.token_authen);
              this.userApiService.initApp(data).then(() => {
              this.notify.success('Đăng nhập thành công');
              // this.redirectTo(this.returnUrl);
              // window.location.assign(this.returnUrl)
              this.router.navigateByUrl(this.returnUrl);
            });
  
            // this.router.navigate(['/trang-chu']);
          } else {
            this.notify.error(this.translate.instant(`error_code.${data.result_code}`));
            // this.notify.error("Tên tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại");
          }
        })
        .catch(error => {
          this.isLoading =false;
        })
    }
  }
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }

 


}
