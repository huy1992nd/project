import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component'
import { SignupComponent } from './signup/signup.component';
import {ApiService} from './../../services/api.service'
import { AppRoutingModule } from './../../app-routing.module';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import {MatAngularModule} from './../../common/mat-angular.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import { RegisterVerifyComponent } from './register-verify/register-verify.component'
@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LoginComponent,
    SignupComponent,
    RegisterVerifyComponent
  ],
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatAngularModule
  ],
  exports: [
    ForgotPasswordComponent,
    LoginComponent,
    SignupComponent
  ],
  providers: [ApiService]
})
export class RegisterModule {}
