import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertComponent } from './alert/alert.component';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { AlertService } from './services/alert.service';
import { ChatService } from './services/chat.service';
import { GlobalService } from './services/global.service';
import { UploadService } from './services/upload.service';
import { UserService } from './services/user.services';
import { ScriptLoaderService } from './services/script-loader.service';
import { SideNavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { DataService } from './services/data.service';
import { EventBusService } from './services/eventbus.service';

const coreServices = [ScriptLoaderService, AlertService, ChatService, GlobalService, UploadService, UserService, DataService, EventBusService];

@NgModule({
    imports: [
        CommonModule, RouterModule, HttpClientModule,
        AngularFireAuthModule, AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
    ],
    exports: [RouterModule, HttpClientModule, SideNavComponent, HeaderComponent],
    declarations: [SideNavComponent, HeaderComponent],
    providers: [coreServices] // these should be singleton
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {    // Ensure that CoreModule is only loaded into AppModule

    // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        super(parentModule);
    }

}