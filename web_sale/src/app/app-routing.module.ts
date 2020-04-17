import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/register/login/login.component';
import {SignupComponent} from './components/register/signup/signup.component';
import {RegisterVerifyComponent} from './components/register/register-verify/register-verify.component';
import {ForgotPasswordComponent} from './components/register/forgot-password/forgot-password.component';
import {DashboardComponent} from './components/home/dashboard/dashboard.component';
import {AuthGuard} from './common/auth.guard';
import {TranslateModule, TranslateService, TranslatePipe, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
// Sale
import {SaleComponent} from './components/sale/sale.component';
import {ListViewComponent} from './components/sale/list-view/list-view.component';
import {ViewDetailComponent} from './components/sale/view-detail/view-detail.component';
// Song
import {SongComponent} from './components/song/song.component';
import {DashboardSongComponent} from './components/song/dashboard-song/dashboard-song.component';
import {SongDetailComponent} from './components/song/song-detail/song-detail.component';
import { FavoritesSongComponent } from './components/song/favorites-song/favorites-song.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';

const routes: Routes = [ 
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: SignupComponent,
	},
	{
		path: 'forgot-password',
		component: ForgotPasswordComponent,
	},
	{
		path: 'register-verify',
		component: RegisterVerifyComponent,
	},
	{
        canActivate: [AuthGuard],
		path: '',
        component: SongComponent,
        children: [
            {
                path: '',
                component: DashboardSongComponent
            },
            {
                path: 'user-profile',
                component: UserProfileComponent
            },
            {
                path: 'favorites',
                component: FavoritesSongComponent
            },
            {
                path: 'detail/:id',
                component: SongDetailComponent
            },
        ],
    },
    {
		path: '**',
		component: NotFoundPageComponent,
	},
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes), TranslateModule],
    exports: [RouterModule, TranslatePipe],
    providers: [TranslateModule, TranslateService]
})
export class AppRoutingModule {
}
