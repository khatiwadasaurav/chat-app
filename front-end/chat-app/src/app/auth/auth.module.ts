import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { LogoutComponent } from './logout/logout.component';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth.routing.module';
import { AuthenticationService } from './authentication.service';
import { AlertComponent } from '../core/alert/alert.component';


@NgModule({
  declarations: [AuthComponent, LogoutComponent, AlertComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AuthRoutingModule,

  ],
  providers: [AuthenticationService],
  entryComponents: [AlertComponent],
})
export class AuthModule { }
