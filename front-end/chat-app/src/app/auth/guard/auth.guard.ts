import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalVaribale } from "../../core/services/global.service";
import { AngularFireAuth } from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private _router: Router,
    private _afAuth: AngularFireAuth,
  ) { }
  currentRoute = "";

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._afAuth.authState.pipe(map(auth => {
      this.currentRoute = state.url;
      const userRole = localStorage.getItem(GlobalVaribale.userRole);
      if (auth && auth.uid && localStorage.getItem(GlobalVaribale.clientId)) {
        if (userRole == 'user') {
          return true;
        } else {
          this._router.navigate(["/login"]);
          return false;
        }
      } else {
        this._router.navigate(["/login"]);
        return false;
      }
    }));
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
