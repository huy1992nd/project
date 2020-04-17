import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatAngularModule} from './../../common/mat-angular.module';
import { AppRoutingModule } from './../../app-routing.module';
import { FormsModule ,ReactiveFormsModule}   from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManagerBankComponent } from './manager-bank/manager-bank.component';
import { CreateBankDialogComponent } from './manager-bank/create-bank-dialog/create-bank-dialog.component';
import { UpdateBankComponent } from './manager-bank/update-bank/update-bank.component';
import { ManagerAccountSiteComponent } from './manager-account-site/manager-account-site.component';
import { CreateAccountSiteDialogComponent } from './manager-account-site/create-account-site-dialog/create-account-site-dialog.component';
import { UpdateAccountSiteComponent } from './manager-account-site/update-account-site/update-account-site.component';
import { UpdateBankDialogComponent } from './manager-bank/update-bank-dialog/update-bank-dialog.component';
import { DeleteBankDialogComponent } from './manager-bank/delete-bank-dialog/delete-bank-dialog.component';
import { DeleteAccountSiteDialogComponent } from './manager-account-site/delete-account-site-dialog/delete-account-site-dialog.component';
import { ManagerRateSiteComponent } from './manager-rate-site/manager-rate-site.component';
import { CreateRateSiteDialogComponent } from './manager-rate-site/create-rate-site-dialog/create-rate-site-dialog.component';
import { UpdateRateSiteComponent } from './manager-rate-site/update-rate-site/update-rate-site.component';
import { DeleteRateSiteDialogComponent } from './manager-rate-site/delete-rate-site-dialog/delete-rate-site-dialog.component';
import { ManagerFeeSiteComponent } from './manager-fee-site/manager-fee-site.component';
import { UpdateFeeSiteComponent } from './manager-fee-site/update-fee-site/update-fee-site.component';



@NgModule({
  declarations: [ManagerBankComponent, CreateBankDialogComponent, UpdateBankComponent, ManagerAccountSiteComponent, CreateAccountSiteDialogComponent, UpdateAccountSiteComponent, UpdateBankDialogComponent, DeleteBankDialogComponent, DeleteAccountSiteDialogComponent, ManagerRateSiteComponent, CreateRateSiteDialogComponent, UpdateRateSiteComponent, DeleteRateSiteDialogComponent, ManagerFeeSiteComponent, UpdateFeeSiteComponent],
  imports: [
    CommonModule,
    MatAngularModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  exports: [
    ManagerBankComponent,
    ManagerAccountSiteComponent
  ],
  entryComponents: [
    CreateBankDialogComponent,
    UpdateBankDialogComponent,
    DeleteBankDialogComponent,
    CreateAccountSiteDialogComponent,
    DeleteAccountSiteDialogComponent,
    CreateRateSiteDialogComponent,
    DeleteRateSiteDialogComponent,
  ]
})
export class PaymentModule { }
