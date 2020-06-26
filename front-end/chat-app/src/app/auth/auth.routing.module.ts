import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '', component: AuthComponent,
    },
    {
        path: 'signup', component: AuthComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}
