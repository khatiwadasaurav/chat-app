import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { User } from '../models/user';


@Injectable()
export class GlobalService {

  userRole: string;
  userDisplayName: string;
  userClientId: string;
  userEmail: string;
  userPhoto: string;
  loggedUser: any;
  adminDriver: boolean;
  constructor(
    private _afauth: AngularFireAuth,
    private _db: AngularFirestore,
    private http: HttpClient
  ) {
    this.userClientId = null;
    this.userRole = null;
    this.adminDriver = null;
    this.userDisplayName = null;
    this.userEmail = null;
    this.userPhoto = null;
    this.loggedUser = null;
    this.refreshUser();
  }

  refreshUser() {
    let currentUser;
    this._afauth.authState.subscribe(data => {
      currentUser = data;
      this.loggedUser = currentUser;
      if (currentUser) {
        this.userDisplayName = currentUser.displayName;
        this.userEmail = currentUser.email;
        this.userPhoto = currentUser.photoURL;
        localStorage.setItem(GlobalVaribale.fullName, this.userDisplayName);
        const userRef = this._db.collection("users").doc(currentUser.uid).ref;
        userRef.get().then(userRefDoc => {
          const data = userRefDoc.data();
          this.userClientId = data.client;
          this.userRole = data.Role;
          this.adminDriver = data.AdminDriver;
        });
      }
    });
  }

  getAuditors() {
    return this._db.collection("auditors").ref.get();
  }

  getClientID(): Observable<User> {
    const userObservable = new Observable<User>(observer => {
      this._afauth.authState.subscribe(data => {
        if (data) {
          return this._db.collection("users").doc(data.uid).ref.get().then(userRefDoc => observer.next(new User(userRefDoc.data(), userRefDoc.id)))
        }
      })
    })
    return userObservable;

  }
  getClientsDetailsById(clientId: any) {
    return this._db
      .collection("clients")
      .doc(clientId)
      .ref.get();
  }
  getReferralCodeFromAuditor(referralCode: any) {
    return this._db
      .collection("auditors")
      .ref.where("code", "==", referralCode)
      .get();
  }
  getClientEmailAddress(email: string) {
    return this._db
      .collection("users")
      .ref.where("emailAddress", "==", email)
      .get();
  }
  checkClientEmailAddress(email) {
    let url = environment.postUrl + "/checkEmail";
    return this.http.post(url, email);
  }
  checkClientPhoneNumber(phoneNumber) {
    let url = environment.postUrl + "/checkPhone";
    return this.http.post(url, phoneNumber);
  }
}

export enum GlobalVaribale {
  clientId = "_;32-dtjg|N)S'IxZl:sg!(]Xo",
  userRole = "userRole",
  userRef = "users",
  contactRef = "contacts",
  messageRef = "messages",
  clientRef = "clients",
  vehicleRef = "vehicles",
  massManagementRef = "amms",
  jobsRef = "jobs",
  faultsRef = "faultReport",
  driverRef = "drivers",
  trailingEqpRef = "trailingEquipments",
  documentsRef = "documents",
  stopsRef = "stops",
  dayEndJobsRef = "dayEndJobs",
  groupChatMessageRef = "groupChats",
  userSubscription = "userSubscriptionPlan",
  userBrainTreeId = "userBrainTreeId",
  maxOdometerLimit = "maxOdometerLimit",
  maxNumberOfDaysForMaintainance = "maxNumberOfDaysForMaintainance",
  adminDriver = "oG8~b-73111!51i",
  standAloneLatitude = "standAloneLatitude",
  standAloneLongitude = "standAloneLongitude",
  totalJobsCount = "totalJobsCount",
  userSubscriptionExpired = "*q+~!E@ ;G2*3/Y",
  trialDaysLeft = "-2?!60Hp1/$!;jo",
  trialExpired = "%]wD#:@xDgRB9W&.",
  subscriptionId = ">O6*kr361PCiRQZ",
  subscriptionPlan = "subscriptionPlan",
  totalNumberOfTrucks = "mkP-D@!5#9)8qeO",
  price = "%#7+w~GVD'[=hRS",
  premiumPricePerTruck = "premiumPricePerTruck",
  fullName = "fullName",
  companyName = "companyName",
  loggedInFromSuperAdmin = "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  superAdminId = "082a16695081a01c914f820ec4f004fc869a0250",
  tempSuperAdminId = "82ef30abca7a3e5333b5b41474b8366ad170c049",
  firstTimeLogin = "e06ec741fec209574232912161c1539f58dd8df2",
  freeTrialUser = "bQQ1ioW4OeA8eiIUshNBwXGou7iEClzd",
  directDebitUser = "914f820ec4f004fc869a0250mkP-D@!5#9)8qeO",
  dialogBoolean = "dialogBoolean"
}
