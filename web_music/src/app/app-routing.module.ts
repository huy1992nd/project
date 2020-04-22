import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/register/login/login.component';
import {SignupComponent} from './components/register/signup/signup.component';
import {RegisterVerifyComponent} from './components/register/register-verify/register-verify.component';
import {ForgotPasswordComponent} from './components/register/forgot-password/forgot-password.component';
import {AuthGuard} from './common/auth.guard';
import {AuthPostGuard} from './common/authPost.guard';
import {TranslateModule, TranslateService, TranslatePipe, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Song
import {SongComponent} from './components/song/song.component';
import {DashboardSongComponent} from './components/song/dashboard-song/dashboard-song.component';
import {SongDetailComponent} from './components/song/song-detail/song-detail.component';
import { FavoritesSongComponent } from './components/song/favorites-song/favorites-song.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
// list page song
import {PageSongComponent} from './components/song/page-song/page-song.component';
import {ListPostSongComponent} from './components/song/page-song/list/list.component';
import {CreatePostSongComponent} from './components/song/page-song/create/create.component';
import {EditPostSongComponent} from './components/song/page-song/edit/edit.component';
import {PageSongViewComponent} from './components/song/page-song/page-song-view/page-song-view.component';

const routes: Routes = [ 
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
                path: 'favorites',
                component: FavoritesSongComponent
            },
            {
                path: 'detail/:id',
                component: SongDetailComponent
            },
            {
                path: 'user-profile',
                component: UserProfileComponent
            },
            {
                path: 'notification',
                component: PageSongComponent,
                children: [
                    {
                        path: '',
                        component: ListPostSongComponent
                    },
                    {
                        path: 'view/:id',
                        component: PageSongViewComponent
                    },
                    {
                        canActivate: [AuthPostGuard],
                        path: 'create',
                        component: CreatePostSongComponent
                    },
                    {
                        canActivate: [AuthPostGuard],
                        path: 'edit/:id',
                        component: EditPostSongComponent
                    }                    
                ]
            }
        ],
    },
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
        path: 'about-website',
        component: AboutMeComponent
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
