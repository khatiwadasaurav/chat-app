import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase";
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private _afAuth: AngularFireAuth) { }

    login(email: string, password: string) {
        return this.http
            .post(
                "/api/authenticate",
                JSON.stringify({ email: email, password: password })
            )
            .pipe(map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    console.log(user.token);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem("currentUser", JSON.stringify(user));
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem("currentUser");
        return this._afAuth.signOut()
    }

    sendEmailVerfication(email: string, password: string) {
        const signin = this._afAuth
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                return user.user.sendEmailVerification();
            })
            .catch(error => {
                return error;
            });
        return signin;
    }

    updateUser(fullName, photoLink, email?) {
        var user = firebase.auth().currentUser;
        return user.updateProfile({
            photoURL: photoLink,
            displayName: fullName
        });
    }

    updateEmail(email) {
        var user = firebase.auth().currentUser;

        return user.updateEmail(email);
    }
    createUserWithEmailAndPassword(userData) {
        const url = environment.postUrl + "/adminSignup";

        return this.http.post(url, userData).toPromise();
        // var user = firebase.auth().createUserWithEmailAndPassword(
        //     email,
        //     password,
        // );
        // return user;
    }

    updatePassword(newPassword, email, password) {
        let user = firebase.auth().currentUser;
        return this._afAuth
            .signInWithEmailAndPassword(email, password)
            .then(loggedUser => {
                return user.updatePassword(newPassword).then(() => {
                    return {
                        status: true
                    };
                })
                    .catch(err => {
                        return {
                            status: false
                        }
                    })
            })
            .catch(error => {
                return {
                    status: false
                };
            });
    }
}
