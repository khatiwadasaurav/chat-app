import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { UserService } from 'src/app/core/services/user.services';
import { ChangePasswordRoutingModule } from './change-password.routing.module';


@NgModule({
    imports: [
        CommonModule,
        ChangePasswordRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ChangePasswordRoutingModule.components
    ],
    providers: [
        GlobalService,
        UserService,
        AuthenticationService
    ]
})
export class ChangePasswordModule {

}
