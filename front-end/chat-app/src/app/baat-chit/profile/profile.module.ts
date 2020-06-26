import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile.routing.module';
import { GlobalService } from 'src/app/core/services/global.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { DataService } from 'src/app/core/services/data.service';
import { EventBusService } from 'src/app/core/services/eventbus.service';


@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ], exports: [
        ProfileRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ], declarations: [
        ProfileRoutingModule.components
    ],
    providers: [
        GlobalService,
        UploadService,
        ContactService,
        DataService,
        EventBusService
    ]
})
export class ProfileModule {
}
