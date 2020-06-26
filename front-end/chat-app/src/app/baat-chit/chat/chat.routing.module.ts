import { NgModule } from "@angular/core";
import { ChatComponent } from './chat.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: "",
        component: ChatComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatRoutingModule {
    static components = [ChatComponent];
}