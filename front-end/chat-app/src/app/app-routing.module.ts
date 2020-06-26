import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from './auth/logout/logout.component';


const routes: Routes = [
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(v => v.AuthModule) },
  { path: 'signup', loadChildren: () => import('./auth/auth.module').then(v => v.AuthModule) },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: '/chats', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
