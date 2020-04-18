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
// Post Module
import {CmsComponent} from './components/cms/cms.component';
import {CmsPostComponent} from './components/cms/cms-post/cms-post.component';
import {CmsPostListComponent} from './components/cms/cms-post/cms-post-list/cms-post-list.component';
import {CmsPostCreateComponent} from './components/cms/cms-post/cms-post-create/cms-post-create.component';
import {CmsPostEditComponent} from './components/cms/cms-post/cms-post-edit/cms-post-edit.component';
// Taxonomy Module
import {CmsTaxonomyComponent} from './components/cms/cms-taxonomy/cms-taxonomy.component';
import {CmsTaxonomyListComponent} from './components/cms/cms-taxonomy/cms-taxonomy-list/cms-taxonomy-list.component';
import {CmsTaxonomyEditComponent} from './components/cms/cms-taxonomy/cms-taxonomy-edit/cms-taxonomy-edit.component';
import {CmsMenuListComponent} from './components/cms/cms-menu/cms-menu-list/cms-menu-list.component';
// Menu Node Module
import {CmsMenuNodeComponent} from './components/cms/cms-menu-node/cms-menu-node.component';
import {CmsMenuNodeListComponent} from './components/cms/cms-menu-node/cms-menu-node-list/cms-menu-node-list.component';
// Page Module
import {CmsPageComponent} from './components/cms/cms-page/cms-page.component';
import {CmsPageListComponent} from './components/cms/cms-page/cms-page-list/cms-page-list.component';
import {CmsPageCreateComponent} from './components/cms/cms-page/cms-page-create/cms-page-create.component';
import {CmsPageEditComponent} from './components/cms/cms-page/cms-page-edit/cms-page-edit.component';
// Song
import {SongComponent} from './components/song/song.component';
import {DashboardSongComponent} from './components/song/dashboard-song/dashboard-song.component';
import {SongDetailComponent} from './components/song/song-detail/song-detail.component';
import { FavoritesSongComponent } from './components/song/favorites-song/favorites-song.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { AboutMeComponent } from './components/about-me/about-me.component';

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
            }
        ],
    },
    {
        canActivate: [AuthGuard],
        path: 'cms',
        component: CmsComponent,
        children: [
            // Post Module
            {
                path: 'post',
                component: CmsPostComponent,
                children: [
                    {
                        path: 'index',
                        component: CmsPostListComponent
                    },
                    {
                        path: 'create',
                        component: CmsPostCreateComponent
                    },
                    {
                        path: 'edit/:id',
                        component: CmsPostEditComponent
                    }
                ]
            },

            // Page Module
            {
                path: 'page',
                component: CmsPageComponent,
                children: [
                    {
                        path: 'index',
                        component: CmsPageListComponent
                    },
                    {
                        path: 'create',
                        component: CmsPageCreateComponent
                    },
                    {
                        path: 'edit/:id',
                        component: CmsPageEditComponent
                    },
                ]
            },

            // Taxonomy Module
            {
                path: 'taxonomy',
                component: CmsTaxonomyComponent,
                children: [
                    {
                        path: 'index',
                        component: CmsTaxonomyListComponent
                    },
                    {
                        path: 'edit/:id',
                        component: CmsTaxonomyEditComponent
                    }
                ]
            },
            // Menu Module
            {
                path: 'menu',
                component: CmsTaxonomyComponent,
                children: [
                    {
                        path: 'index',
                        component: CmsMenuListComponent
                    }
                ]
            },

            // Menu Node Module
            {
                path: 'menunode',
                component: CmsMenuNodeComponent,
                children: [
                    {
                        path: 'index/:id',
                        component: CmsMenuNodeListComponent
                    }
                ]
            },
        ]
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
