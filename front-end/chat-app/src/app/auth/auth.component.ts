import Swal from "sweetalert2/dist/sweetalert2.js";
import { Component, ViewEncapsulation, OnInit, ViewChild, ViewContainerRef, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ScriptLoaderService } from '../core/services/script-loader.service';
import { UserService } from '../core/services/user.services';
import { AuthenticationService } from './authentication.service';
import { AlertService } from '../core/services/alert.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { UploadService } from '../core/services/upload.service';
import { GlobalService, GlobalVaribale } from '../core/services/global.service';
import { Helpers } from '../core/helpers/helpers';
import { LoginCustom } from '../shared/loginCustom';
import { PasswordValidation } from '../shared/validators/passwordValidation';
import { Upload } from '../core/models/upload';
import * as firebase from 'firebase/app';
import 'firebase/auth'
import { AlertComponent } from '../core/alert/alert.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from "../../environments/environment";


@Component({
    selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
    styleUrls: ["./templates/login.component.scss"],
    templateUrl: "./templates/login.component.html",
    encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {

    signnUpForm: FormGroup;
    emailAlert = 'Enter an valid e-mail ID.';
    requiredAlert = "This field is required"
    passwordAlert = 'Password must be between 8-20 characters.';
    confirmPasswordAlert = 'Password does not match!';


    public model: any = {};
    public loading = false;
    public returnUrl: string;
    public selectedFile: any;
    public paymentResponse: any;
    public noUserFoundMessage: string;
    public chargeAmount = 55.55;
    public plans: any;
    public currencyType;
    public subscriptionId: any;
    public environmentUrl = "";
    public clientId: string;
    public subscriptionPlanId: string;
    public subscriptionObject = {
        initalPrice: 0,
        discount: 0
    };
    public logintemplate = {
        showPaymentOptions: true,
        showUserDetailOptions: true,
        showLoginPage: false,
        forgottenPasswordSection: true
    };
    public formFilled: boolean = true;
    public initialvalueInitialized: boolean = false;
    public emailAddressExists: boolean = false;
    public phoneNumberExists: boolean = false;
    private actionCodeSettings = {
        url: `https://${environment.firebase.loginUrl}`,
        handleCodeInApp: false
    }


    @ViewChild("alertSignin", { read: ViewContainerRef, static: false })
    alertSignin: ViewContainerRef;
    @ViewChild("alertSignup", { read: ViewContainerRef, static: false })
    alertSignup: ViewContainerRef;
    @ViewChild("alertForgotPass", { read: ViewContainerRef, static: false })
    alertForgotPass: ViewContainerRef;
    @ViewChild("signupForm", { static: true }) signUpForm: ElementRef;
    @ViewChild("agree", { static: false }) agree: ElementRef;
    @ViewChild("cardBody", { static: false }) cardBody: ElementRef;
    @ViewChild("signupButton", { static: false }) signupButton: ElementRef;
    @ViewChild("showPassword", { static: false }) showPassword: ElementRef;
    @ViewChild("passwordfield", { static: false }) passwordfield: ElementRef;

    constructor(
        private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private _afAuth: AngularFireAuth,
        private _upSvc: UploadService,
        private cfr: ComponentFactoryResolver,
        private _globals: GlobalService,
        private formBuilder: FormBuilder
    ) { }
    ngOnInit() {
        this.environmentUrl = environment.postUrl;
        this.model.remember = true;
        this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";
        if (this._router.url === "/signup") {
            this.generic("signUp");
        }
        localStorage.removeItem(GlobalVaribale.clientId);
        this._script
            .loadScripts(
                "body",
                [
                    "assets/vendors/base/vendors.bundle.js",
                    "assets/demo/default/base/scripts.bundle.js"
                ],
                true
            )
            .then(() => {
                Helpers.setLoading(false);
                LoginCustom.init();
            });
        this.createFormControls();
        setTimeout(() => {
            this.popUp();
        }, 2000);

    }

    createFormControls() {
        const countryCodeRegex = /^(\+?\d{1,3}|\d{1,4})$/gm;
        const phoneNumberRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm;

        this.signnUpForm = this.formBuilder.group({
            "fullname": ["", Validators.required],
            "photoURL": ["",],
            "phoneNumber": ["", [Validators.required, Validators.pattern(phoneNumberRegex)]],
            "countryCode": ["+977", [Validators.required, Validators.pattern(countryCodeRegex)]],
            "email": ["", [Validators.required,
            Validators.email
            ]],
            "password": ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
            "rPassword": ["", Validators.required],
            "agree": ["",]
        }, {
            validator: PasswordValidation.MatchPassword
        });
    }


    generic(data) {
        switch (data) {
            case "forgotPassword":
                this.logintemplate.forgottenPasswordSection = false;
                this.logintemplate.showLoginPage = true;
                this.logintemplate.showPaymentOptions = true;
                this.logintemplate.showUserDetailOptions = true;
                break;
            case "signUp":
                this.logintemplate.forgottenPasswordSection = true;
                this.logintemplate.showLoginPage = true;
                this.logintemplate.showPaymentOptions = true;
                this.logintemplate.showUserDetailOptions = false;
                this.model = {};
                this.signUpCheckBox();
                break;
            case "paymentOptions":
                this.logintemplate.showPaymentOptions = false;
                this.logintemplate.showLoginPage = true;
                this.logintemplate.showUserDetailOptions = true;
                this.logintemplate.forgottenPasswordSection = true;
                break;
            case "cancel":
                this.logintemplate.showLoginPage = false;
                this.logintemplate.showPaymentOptions = true;
                this.logintemplate.showUserDetailOptions = true;
                this.logintemplate.forgottenPasswordSection = true;
                break;
            case "previousButton":
                this.logintemplate.showLoginPage = true;
                this.logintemplate.showPaymentOptions = true;
                this.logintemplate.forgottenPasswordSection = true;
                this.logintemplate.showUserDetailOptions = false;
                break;
            case "backToLogin":
                this.logintemplate.showLoginPage = false;
                this.logintemplate.showPaymentOptions = true;
                this.logintemplate.forgottenPasswordSection = true;
                this.logintemplate.showUserDetailOptions = true;
                this.model = {};
        }
    }

    allFormFilled() {
        this.model = this.signnUpForm.value;
        if (this.model.fullname && this.model.email && this.model.password && this.model.phoneNumber) {
            if (this.emailAddressExists) {
                this.formFilled = true;
            } else {
                this.formFilled = false;
            }
        }
    }

    signUpCheckBox() { }
    signin() {
        this.loading = true;
        this._globals.userRole = null;
        this._globals.userPhoto = null;
        this._globals.userDisplayName = null;
        this._globals.userClientId = null;
        this._afAuth
            .signInWithEmailAndPassword(this.model.email, this.model.password)
            .then(user => {
                if (user.user.emailVerified) {
                    if (this._globals.userClientId && this._globals.userRole) {
                        localStorage.setItem(
                            GlobalVaribale.clientId,
                            this._globals.userClientId
                        );
                        localStorage.setItem(
                            GlobalVaribale.userRole,
                            this._globals.userRole
                        );

                        this.loading = false;
                        this._router.navigate([this.returnUrl]).then(v => {
                            // window.location.reload()
                        });
                    } else {
                        this._globals.getClientID().subscribe(
                            data => {
                                let userEmail = this._afAuth.currentUser['email'];
                                if (data !== undefined) {
                                    localStorage.setItem(GlobalVaribale.clientId, data.client);
                                    this.clientId = data.client;
                                    localStorage.setItem(GlobalVaribale.userRole, data.Role);
                                    let userRole = localStorage.getItem(GlobalVaribale.userRole);
                                    this._router.navigate([this.returnUrl]).then(v => {
                                        // window.location.reload();
                                    });
                                } else {
                                    this.noUserFoundMessage =
                                        "Sorry No User with " + userEmail + " Found";
                                    this.loading = false;
                                }
                            },
                            error => { }
                        );
                    }
                } else {
                    this.loading = false;
                    this.showAlert("alertSignin");
                    this._alertService.error("Email address not verified");
                }
            })
            .catch(error => {
                this.showAlert("alertSignin");
                this._alertService.error(error);
                this.loading = false;
            });
    }


    fileCheck(event) {
        this.selectedFile = event.target.files.item(0);
    }

    signup() {
        this.model = this.signnUpForm.value;
        this.model.agree = true;
        this.loading = true;
        Helpers.setLoading(true);
        if (this.selectedFile) {
            let currentUpload = new Upload(this.selectedFile);
            this._upSvc.uploadDocuments(
                currentUpload,
                "/profiles",
                (progressData) => {
                    let progress = Math.round(progressData);
                    this.signupButton.nativeElement.innerHTML = "Uploading Img: " + progress + '%';
                },
                (uploaded: Upload) => {
                    this.model.photoURL = uploaded.url;
                    this.signupButton.nativeElement.innerHTML = "Creating User";
                    this.createUser();
                }
            );
        } else {
            this.model.photoURL =
                environment.dummyImageUrl;
            this.signupButton.nativeElement.innerHTML = "Creating User";
            this.createUser();
        }
    }

    createUser() {
        this._userService.create(this.model).subscribe(
            data => {
                this._afAuth
                    .signInWithEmailAndPassword(this.model.email, this.model.password)
                    .then(user => {
                        firebase
                            .auth()
                            .currentUser.sendEmailVerification()
                            .then(() => {
                                this._authService.logout();
                                this.loading = false;
                                Helpers.setLoading(false);
                                this.showAlert("alertSignin");
                                this._alertService.success(
                                    "Thank you. To complete your registration please check your email.",
                                    true
                                );
                                this.loading = false;
                                this.generic("cancel");
                                this.model = {};
                                this.signupButton.nativeElement.innerHTML = "Sign Up";
                            }).catch(err => {
                                console.log(err);
                                this.showAlert("alertSignin");
                                this._alertService.error(err);
                                this.loading = false;
                                Helpers.setLoading(false);
                            });
                    })
                    .catch(error => {
                        this.showAlert("alertSignin");
                        this._alertService.error(error);
                        this.loading = false;
                        Helpers.setLoading(false);
                    });
            },
            error => {
                const body = JSON.parse(error._body);
                this.showAlert("alertSignup");
                this._alertService.error(body.message);
                this.loading = false;
            }
        );
    }

    freeTrialSignup(model) {
        this.model = this.signnUpForm.value;

        this.model.phoneNumber = this.phoneNumberFormatter(this.model.countryCode, this.model.phoneNumber);

        this.signup();
    }

    //code to format phone number to + countrycode phonenumber format
    phoneNumberFormatter(countryCode, number) {
        let plus = "+";
        let countryCodeFormatter = countryCode.split("");
        if (countryCodeFormatter[0] !== '+') {
            plus += countryCode;
            countryCode = plus;
        }
        return (countryCode + number)
    }

    onDropinLoaded(event) { }

    forgotPass() {
        this.loading = true;
        let textMessage = "Email sent to " + this.model.email;
        this._userService
            .forgotPassword(this.model.email)
            .then(data => {
                this.showAlert("alertSignin");
                this._alertService.success(
                    "Cool! Password recovery instruction has been sent to your email.",
                    true
                );
                this.loading = false;
                Swal.fire({
                    position: "center",
                    type: "success",
                    title: "Password Reset Successful",
                    text: textMessage,
                    showConfirmButton: false,
                    timer: 2000
                });
                this.generic("cancel");
                this.model = {};
            })
            .catch(error => {
                this.showAlert("alertForgotPass");
                this._alertService.error(error);
                this.loading = false;
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    checkRefferalCode(referralCode) {
        this.signnUpForm["referralCode"] = null;
        this._globals
            .getReferralCodeFromAuditor(referralCode)
            .then(auditorData => {
                auditorData.forEach(audData => {
                    if (audData.data()) {
                        this.model["referralCode"] = referralCode;
                    } else {
                        this.checkReferealCode = true;
                        this.noRefferalMessage = "No Refferal code found";
                    }
                });
            })
            .catch(error => { });
    }
    checkEmailAlreadyExist(email) {
        let emailAddress = { email: email };
        this._globals
            .checkClientEmailAddress(emailAddress).toPromise()
            .then((clientDetails: Response) => {
                if (clientDetails['status'] == 200) {
                    this.emailAddressExists = false;
                }
            })
            .catch((error: HttpErrorResponse) => {
                if (error.status == 200) {
                    this.emailAddressExists = false;
                } else {
                    this.emailAddressExists = true;
                }
            });
    }

    checkPhoneExists(countryCode, phoneNumber) {
        let phone = { phoneNumber: this.phoneNumberFormatter(countryCode, phoneNumber) };
        this._globals.checkClientPhoneNumber(phone).toPromise().then((clientDetails: Response) => {
            if (clientDetails['status'] == 200) {
                this.phoneNumberExists = false;
            }
        }).catch((error: HttpErrorResponse) => {
            if (error.status == 200) {
                this.phoneNumberExists = false;
            } else {
                this.phoneNumberExists = true;
            }
        })

    }
    showPasswordFun() {
        let currentType = this.showPassword.nativeElement.type;
        if (currentType == "password") {
            this.passwordfield.nativeElement.classList.remove('fa-eye')
            this.passwordfield.nativeElement.classList.add('fa-eye-slash')
            this.showPassword.nativeElement.type = "text";
        } else {
            this.showPassword.nativeElement.type = "password"
            this.passwordfield.nativeElement.classList.remove('fa-eye-slash')
            this.passwordfield.nativeElement.classList.add('fa-eye')

        }
    }
    popUp() {
        //sharpening my js knowlede here :D
        let myDialog = document.createElement("dialog");
        let closeButton = document.createElement('button');
        let brTag = document.createElement('br');
        let text = "[optional]<br><strong>email: dummy@dummymail.com <br>  pw:dummytest1234 </strong> <br>use these for dummy account login 😃";
        let pTag = document.createElement('p');
        pTag.className = "userDetails"
        pTag.innerHTML = text
        myDialog.classList.add('fade-in')
        document.body.appendChild(myDialog)
        closeButton.className = "btn btn-sm btn-danger closeButton";
        closeButton.innerText = "X";
        closeButton.onclick = () => myDialog.remove();
        myDialog.appendChild(closeButton);
        myDialog.appendChild(brTag)
        myDialog.appendChild(pTag);
        myDialog.showModal();
    }
}
