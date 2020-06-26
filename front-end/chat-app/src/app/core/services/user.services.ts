import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { map } from 'rxjs/operators';


@Injectable()
export class UserService {
    mainurl: String = environment.postUrl;

    constructor(
        private _afAuth: AngularFireAuth,
        private http: Http,
        private _router: Router,
        private _db: AngularFirestore,
    ) { }

    verify() {
        // return this.http.get('/api/verify', this.jwt()).map((response: Response) => response.json());
    }

    forgotPassword(email: string, actionCodeSettings?) {
        return firebase.auth().sendPasswordResetEmail(email, actionCodeSettings);
        // return this.http.post('/api/forgot-password', JSON.stringify({ email }), this.jwt()).map((response: Response) => response.json());
    }

    getAll() {
        return this.http
            .get("/api/users", this.jwt())
            .pipe(map((response: Response) => response.json()));

    }

    getById(id: number) {
        return this.http
            .get("/api/users/" + id, this.jwt())
            .pipe(map((response: Response) => response.json()));
    }

    create(user: User) {
        return this.http.post(this.mainurl + "/clientSignup", user);
    }

    createBraintree() {
        let braintreeData = { id: 1, data: "test" };
        return this.http.post(
            this.mainurl + "/newBraintreeCustomer",
            braintreeData
        );
    }

    getPlans() {
        return this.http.get(this.mainurl + "/getPlans");
    }

    getCustomer(customerId) {
        return this.http.post(this.mainurl + "/getCustomer", customerId);
    }

    update(user: User) {
        return this.http
            .put("/api/users/" + user.id, user, this.jwt())
            .pipe(map((response: Response) => response.json()));

    }

    delete(id: number) {
        return this.http
            .delete("/api/users/" + id, this.jwt())
            .pipe(map((response: Response) => response.json()));
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.token) {
            let headers = new Headers({
                Authorization: "Bearer " + currentUser.token,
                "Content-Type": "application/json"
            });
            return new RequestOptions({ headers: headers });
        }
    }
}
