import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { BaatChit } from './baat-chit.component';

const routes: Routes = [
    {
        path: "",
        component: BaatChit,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: "index",
                loadChildren: () => import('./dashboard/dashboard.module').then(dashboard => dashboard.DashboardModule)
            },
            {
                path: "404",
                loadChildren: () => import('../core/not-found/not-found.module').then(notFound => notFound.NotFoundModule)

            },
            {
                path: "profile",
                loadChildren: () => import('./profile/profile.module').then(profile => profile.ProfileModule)
            },
            {
                path: "change-password",
                loadChildren: () => import('./change-password/change-password.module').then(changePassword => changePassword.ChangePasswordModule)
            },
            {
                path: "chats",
                loadChildren: () => import('./chat/chat.module').then(chat => chat.ChatModule)
            },
            {
                path: "",
                redirectTo: "chats",
                pathMatch: "full"
            }
        ]
    },

    {
        path: "**",
        redirectTo: "404",
        pathMatch: "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: []
})
export class BaatChitRoutingModule { }