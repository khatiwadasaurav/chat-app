import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Helpers } from 'src/app/core/helpers/helpers';
import { AuthenticationService } from 'src/app/auth/authentication.service';



@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class LogoutComponent implements OnInit, OnDestroy {


    constructor(private _router: Router,
        private _authService: AuthenticationService,
    ) {
    }

    ngOnInit(): void {
        Helpers.setLoading(true);
        localStorage.clear();
        this._authService.logout();
        this._router.navigate(['/login']);

    }

    ngOnDestroy(): void {
        localStorage.clear();
    }
}