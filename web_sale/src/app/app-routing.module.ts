import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/register/login/login.component';
import {LoginfaceComponent} from './components/login/loginface/loginface.component';
import {SignupComponent} from './components/register/signup/signup.component';
import {RegisterVerifyComponent} from './components/register/register-verify/register-verify.component';
import {ForgotPasswordComponent} from './components/register/forgot-password/forgot-password.component';
import {DashboardComponent} from './components/home/dashboard/dashboard.component';
import {UserComponent} from './components/user/user.component';
import {ListCustomersComponent} from './components/customer/list-customers/list-customers.component';
import {AuthGuard} from './common/auth.guard';
import {TranslateModule, TranslateService, TranslatePipe, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

/**
 * Module load for CMS
 */
import {CmsComponent} from './components/cms/cms.component';
import {CmsDashboardComponent} from './components/cms/cms-dashboard/cms-dashboard.component';
// Post Module
import {CmsPostComponent} from './components/cms/cms-post/cms-post.component';
import {CmsPostListComponent} from './components/cms/cms-post/cms-post-list/cms-post-list.component';
import {CmsPostCreateComponent} from './components/cms/cms-post/cms-post-create/cms-post-create.component';
import {CmsPostEditComponent} from './components/cms/cms-post/cms-post-edit/cms-post-edit.component';
// Page Module
import {CmsPageComponent} from './components/cms/cms-page/cms-page.component';
import {CmsPageListComponent} from './components/cms/cms-page/cms-page-list/cms-page-list.component';
import {CmsPageCreateComponent} from './components/cms/cms-page/cms-page-create/cms-page-create.component';
import {CmsPageEditComponent} from './components/cms/cms-page/cms-page-edit/cms-page-edit.component';
// Taxonomy Module
import {CmsTaxonomyComponent} from './components/cms/cms-taxonomy/cms-taxonomy.component';
import {CmsTaxonomyListComponent} from './components/cms/cms-taxonomy/cms-taxonomy-list/cms-taxonomy-list.component';
import {CmsTaxonomyEditComponent} from './components/cms/cms-taxonomy/cms-taxonomy-edit/cms-taxonomy-edit.component';
// Menu Module
import {CmsMenuComponent} from './components/cms/cms-menu/cms-menu.component';
import {CmsMenuListComponent} from './components/cms/cms-menu/cms-menu-list/cms-menu-list.component';
import { ListPermissionComponent } from './components/permission/list-permission/list-permission.component';
import {ListRoleComponent} from './components/permission/list-role/list-role.component'
import { ManagerBankComponent } from './components/payment/manager-bank/manager-bank.component';
import { ManagerAccountSiteComponent } from './components/payment/manager-account-site/manager-account-site.component';
import { ManagerRateSiteComponent } from './components/payment/manager-rate-site/manager-rate-site.component';
import { ManagerFeeSiteComponent } from './components/payment/manager-fee-site/manager-fee-site.component';
// Menu Node Module
import {CmsMenuNodeComponent} from './components/cms/cms-menu-node/cms-menu-node.component';
import {CmsMenuNodeListComponent} from './components/cms/cms-menu-node/cms-menu-node-list/cms-menu-node-list.component';
// Sale
import {SaleComponent} from './components/sale/sale.component';
import {ListViewComponent} from './components/sale/list-view/list-view.component';
import {ViewDetailComponent} from './components/sale/view-detail/view-detail.component';
// Song
import {SongComponent} from './components/song/song.component';
import {DashboardSongComponent} from './components/song/dashboard-song/dashboard-song.component';
import {SongDetailComponent} from './components/song/song-detail/song-detail.component';

const routes: Routes = [
    {
        path: 'home',
        canActivate: [AuthGuard],
        component: HomeComponent,
        children: [
            {
                path: 'home',
                component: DashboardComponent
            },
            {
                path: 'user',
                component: UserComponent
            },
            {
                path: 'customer',
                component: ListCustomersComponent
            },
            {
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
				path:'list-permission',
				component:ListPermissionComponent
			},
			{
				path:'list-role',
				component:ListRoleComponent
			},
			{
				path:'list-bank',
				component:ManagerBankComponent
			},
			{
				path:'list-account-site',
				component:ManagerAccountSiteComponent
			},
			{
				path:'list-rate-site',
				component:ManagerRateSiteComponent
			},
			{
				path:'list-fee-site',
				component:ManagerFeeSiteComponent
			},
		]
	},  
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'login_face',
		component: LoginfaceComponent,
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
		path: 'sale',
        component: SaleComponent,
        children: [
            {
                path: 'list-view',
                component: ListViewComponent
            },
            {
                path: 'view-detail',
                component: ViewDetailComponent
            }
        ]
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
                path: 'detail/:id',
                component: SongDetailComponent
            },
        ],
    },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes), TranslateModule],
    exports: [RouterModule, TranslatePipe],
    providers: [TranslateModule, TranslateService]
})
export class AppRoutingModule {
}
