import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCustomersComponent } from './list-customers/list-customers.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { BalanceHistoryComponent } from './balance-history/balance-history.component';



@NgModule({
  declarations: [ListCustomersComponent, UpdateProfileComponent, CustomerInfoComponent, BalanceHistoryComponent],
  imports: [
    CommonModule
  ],
  exports : [
    ListCustomersComponent
  ]
})
export class CustomerModule { }
