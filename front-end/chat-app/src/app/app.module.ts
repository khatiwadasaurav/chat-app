import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthModule } from './auth/auth.module';
import { BaatChitRoutingModule } from './baat-chit/baat-chit.routing.module';
import { BaatChit } from './baat-chit/baat-chit.component';
import { SimpleNotificationsModule } from 'angular2-notifications';



@NgModule({
  declarations: [
    BaatChit,
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule,
    CoreModule,
    SharedModule,
    BaatChitRoutingModule,
    SimpleNotificationsModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
