import { Routes, RouterModule } from '@angular/router'; import { NotFoundComponent } from './not-found.component'; import { NgModule } from '@angular/core'; import { CommonModule } from '@angular/common';


const routes: Routes = [
    {
        path: "",
        component: NotFoundComponent
    }
];


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
    declarations: [NotFoundComponent],
})
export class NotFoundModule { }