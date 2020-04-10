import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {LocationStrategy, HashLocationStrategy,PathLocationStrategy} from '@angular/common';
import { HttpConfigInterceptor } from './interceptors/httpConfig.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS,HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import {RegisterModule} from './components/register/register.module'
import {AuthGuard} from './common/auth.guard';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {UserModule} from './components/user/user.module';
import {CustomerModule} from './components/customer/customer.module';
import {PaymentModule} from './components/payment/payment.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LazyLoadScriptService} from './common/lazyLoadScript';
import {ServiceModule} from './services/service.module'
import { CmsDashboardComponent } from './components/cms/cms-dashboard/cms-dashboard.component';
import { CmsPageComponent } from './components/cms/cms-page/cms-page.component';
import { CmsTaxonomyComponent } from './components/cms/cms-taxonomy/cms-taxonomy.component';
import { CmsPostCreateComponent } from './components/cms/cms-post/cms-post-create/cms-post-create.component';
import { CmsPostListComponent } from './components/cms/cms-post/cms-post-list/cms-post-list.component';
import { CmsComponent } from './components/cms/cms.component';
import { CmsPageCreateComponent } from './components/cms/cms-page/cms-page-create/cms-page-create.component';
import { CmsPostComponent } from './components/cms/cms-post/cms-post.component';
import { CmsPageListComponent } from './components/cms/cms-page/cms-page-list/cms-page-list.component';
import { CmsPostEditComponent } from './components/cms/cms-post/cms-post-edit/cms-post-edit.component';
import { CmsPageEditComponent } from './components/cms/cms-page/cms-page-edit/cms-page-edit.component';
import { CmsTaxonomyListComponent } from './components/cms/cms-taxonomy/cms-taxonomy-list/cms-taxonomy-list.component';
import { CmsTaxonomyEditComponent } from './components/cms/cms-taxonomy/cms-taxonomy-edit/cms-taxonomy-edit.component';
import { CmsMenuComponent } from './components/cms/cms-menu/cms-menu.component';
import { CmsMenuListComponent } from './components/cms/cms-menu/cms-menu-list/cms-menu-list.component';
import { CmsMenuEditComponent } from './components/cms/cms-menu/cms-menu-edit/cms-menu-edit.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { CmsMenuNodeComponent } from './components/cms/cms-menu-node/cms-menu-node.component';
import { CmsMenuNodeListComponent } from './components/cms/cms-menu-node/cms-menu-node-list/cms-menu-node-list.component';

import {MatAngularModule} from './common/mat-angular.module'
import {PermissionModule} from './components/permission/permission.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaleComponent } from './components/sale/sale.component';
import { ListViewComponent } from './components/sale/list-view/list-view.component';
import { ViewDetailComponent } from './components/sale/view-detail/view-detail.component';
import { SongComponent } from './components/song/song.component';
import { DashboardSongComponent } from './components/song/dashboard-song/dashboard-song.component';
import { SongDetailComponent } from './components/song/song-detail/song-detail.component';
import { LoginfaceComponent } from './components/login/loginface/loginface.component';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

let config = new AuthServiceConfig([
  // {
  //   id: GoogleLoginProvider.PROVIDER_ID,
  //   provider: new GoogleLoginProvider("Google-OAuth-Client-Id")
  // },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("698817537590545")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    CmsDashboardComponent,
    CmsPageComponent,
    CmsTaxonomyComponent,
    CmsPostCreateComponent,
    CmsPostListComponent,
    CmsComponent,
    CmsPageCreateComponent,
    CmsPostComponent,
    CmsPageListComponent,
    CmsPostEditComponent,
    CmsPageEditComponent,
    CmsTaxonomyListComponent,
    CmsTaxonomyEditComponent,
    CmsMenuComponent,
    CmsMenuListComponent,
    CmsMenuEditComponent,
    CmsMenuNodeComponent,
    CmsMenuNodeListComponent,
    SaleComponent,
    ListViewComponent,
    ViewDetailComponent,
    SongComponent,
    DashboardSongComponent,
    SongDetailComponent,
    LoginfaceComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RegisterModule,
    ReactiveFormsModule ,
    FormsModule,
    UserModule,
    CustomerModule,
    PaymentModule,
    ServiceModule,
    MatAngularModule,
    CKEditorModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    PermissionModule,
    SocialLoginModule
  ],
  providers: [
    
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    AuthGuard,
    LazyLoadScriptService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
