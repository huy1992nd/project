import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import {LocationStrategy, HashLocationStrategy,PathLocationStrategy} from '@angular/common';
import { HttpConfigInterceptor } from './interceptors/httpConfig.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS,HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import {RegisterModule} from './components/register/register.module'
import {AuthGuard} from './common/auth.guard';
import {AuthPostGuard} from './common/authPost.guard';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {UserModule} from './components/user/user.module';
import {CustomerModule} from './components/customer/customer.module';
import {PaymentModule} from './components/payment/payment.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LazyLoadScriptService} from './common/lazyLoadScript';
import {ServiceModule} from './services/service.module'
import { CKEditorModule } from 'ckeditor4-angular';
import {MatAngularModule} from './common/mat-angular.module';
import {PermissionModule} from './components/permission/permission.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaleComponent } from './components/sale/sale.component';
import { ListViewComponent } from './components/sale/list-view/list-view.component';
import { ViewDetailComponent } from './components/sale/view-detail/view-detail.component';
import { SongComponent } from './components/song/song.component';
import { DashboardSongComponent } from './components/song/dashboard-song/dashboard-song.component';
import { SongDetailComponent } from './components/song/song-detail/song-detail.component';
import { SongHeaderComponent } from './components/song/song-header/song-header.component';
import { SafePipe  } from './pipes/safe-url.pipe';
import { FavoritesSongComponent } from './components/song/favorites-song/favorites-song.component';
import { LikeSongComponent } from './components/song/common/like-song/like-song.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { PageSongComponent } from './components/song/page-song/page-song.component';
import { ListPostSongComponent } from './components/song/page-song/list/list.component';
import { EditPostSongComponent } from './components/song/page-song/edit/edit.component';
import { CreatePostSongComponent } from './components/song/page-song/create/create.component';
import { PageSongViewComponent } from './components/song/page-song/page-song-view/page-song-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    SaleComponent,
    ListViewComponent,
    ViewDetailComponent,
    SongComponent,
    DashboardSongComponent,
    SongDetailComponent,
    SongHeaderComponent,
    SafePipe,
    FavoritesSongComponent,
    LikeSongComponent,
    NotFoundPageComponent,
    AboutMeComponent,
    PageSongComponent,
    ListPostSongComponent,
    EditPostSongComponent,
    CreatePostSongComponent,
    PageSongViewComponent,
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
    // SocialLoginModule
  ],
  providers: [
    
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    AuthGuard,
    AuthPostGuard,
    LazyLoadScriptService
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
