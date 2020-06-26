import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
    selector: "app-change-password",
    templateUrl: "./change-password.component.html",
    encapsulation: ViewEncapsulation.None,

})


export class ChangePasswordComponent implements OnInit {
    loading = false;
    currentPasswordAlert = 'Current Password doesnot match';
    public addProfile: FormGroup;
    currentBool: boolean = false;
    reTypeBool: boolean = false;


    constructor(private _afAuth: AngularFireAuth, private _service: NotificationsService, private globalService: GlobalService, private router: Router, private authService: AuthenticationService, private formBuilder: FormBuilder) {

    }
    ngOnInit() {
        this.createFormControls();
    }

    private createFormControls() {
        this.addProfile = this.formBuilder.group({
            password: ['', Validators.required],
            rePassword: ['', Validators.required],
            currentPassword: ['', { validators: Validators.required, asyncValidators: this.passwordMatchValidator.bind(this), updateOn: 'blur' }]
        })
    }


    passwordEqualCheck() {
        if (this.addProfile.controls['password'].value != this.addProfile.controls['rePassword'].value) {
            this.reTypeBool = true;

        }
        else {
            this.reTypeBool = false;
        }
    }

    editProfile() {
        if (this.addProfile.controls['password'].value == this.addProfile.controls['rePassword'].value) {
            this.authService.updatePassword(this.addProfile.controls['password'].value, this.globalService.userEmail, this.addProfile.controls['currentPassword'].value).then(
                v => {
                    if (v.status) {
                        this._service.success('Success', 'Passwords changed successfully', {
                            timeOut: 3000
                        });
                        this.router.navigate(['/index']);
                    } else {
                        this._service.error('Error', 'Current password does not match', {
                            timeOut: 3000
                        });
                    }
                },
                err => {
                    this._service.error('Error', err.message, {
                        timeOut: 3000
                    });
                }
            )


        }
        else {
            this._service.error('Error', 'Passwords do not match', {
                timeOut: 3000
            });
            console.log('no matchs');
        }
    }

    // custom validator for checking password of current user
    passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
        const password: string = control.value;
        if (control.value === '') {
            return null;
        } else {
            return this._afAuth.signInWithEmailAndPassword(this.globalService.userEmail, password).then(v => {
                return null;
            }).catch(error => {
                console.log(error)
                return { 'passwordFailed': true };
            });
        }
    };



}
