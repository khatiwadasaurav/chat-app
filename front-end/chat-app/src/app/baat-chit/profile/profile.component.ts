import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Upload } from 'src/app/core/models/upload';
import { UploadService } from 'src/app/core/services/upload.service';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { Contact } from 'src/app/core/models/contact';
import { ContactService } from 'src/app/core/services/contact.service';
import { GlobalVaribale } from 'src/app/core/services/global.service';
import { NotificationsService } from 'angular2-notifications';
import { DataService } from 'src/app/core/services/data.service';
import { EventBusService, EmitEvent, Events } from 'src/app/core/services/eventbus.service';



@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {

  @ViewChild("profilePicLabel", { static: false }) profilePicLabel: ElementRef;
  @ViewChild("submitButton", { static: false }) submitButton: ElementRef;

  public addProfile: FormGroup;
  public loading = false;
  public selectedFile: any;
  public newfile: any;
  public userPhoto: string;
  public userData: Contact;
  public selfId: string;

  constructor(
    private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _upSvc: UploadService,
    private authService: AuthenticationService,
    private _contactService: ContactService,
    private _notificationService: NotificationsService,
    private _dataService: DataService,
    private _eventBus: EventBusService
  ) {

  }

  ngOnInit(): void {
    this.createFormControls();
    this.selfId = localStorage.getItem(GlobalVaribale.clientId);
    this._route.queryParams.subscribe(params => {
      console.log(params['userId']);
      this._contactService.getContactDetails(params['userId']).subscribe(data => {
        this.userData = data;
        if (this.userData) {
          this.populateForm(this.userData)
        }
      })
    })
  }
  public createFormControls() {
    this.addProfile = this.formBuilder.group({
      name: ['', Validators.required],
      profileImageUrl: ['',],
    })
  }
  editProfileDetails() {
    this.loading = true;
    if (this.selectedFile) {
      let currentUpload = new Upload(this.selectedFile);
      this._upSvc.pushUploadToVehicles(
        currentUpload,
        "/profiles",
        (progressData) => {
          let progress = Math.round(progressData);
          this.submitButton.nativeElement.innerHTML = "Uploading Img: " + progress + '%';
        },
        (uploaded: Upload) => {
          this.submitButton.nativeElement.innerHTML = "Submitting Data";
          this.userPhoto = uploaded.url;
          this.addProfile.value.profileImageUrl = this.userPhoto;
          this.updateUser();
        }
      );
    } else {
      this.updateUser();
    }
  }

  showDetails() {
    let test = {
      'subject': 'success',
      'value': 'saurav test'
    };
    this._dataService.detailsUpdate(test);
  }

  updateUser() {
    this.authService
      .updateUser(this.addProfile.value.name, this.addProfile.value.profileImageUrl)
      .then(v => {
        this._contactService.updateContactDetails(this.selfId, this.addProfile.value).subscribe(success => {
          this.loading = false
          this.submitButton.nativeElement.innerHTML = "Successful";
          this._notificationService.success("Details Update Successful", null, {
            timeOut: 2000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true
          });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }, err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      });
  }
  populateForm(data: Contact) {
    const formControls = this.addProfile.controls;
    for (const control in formControls) {
      formControls[control].patchValue(data[control])
    }

  }
  fileCheck(event) {
    let reader = new FileReader();
    let self = this;
    reader.onload = function () {
      var dataURL = reader.result;
      self.newfile = dataURL;
    };
    this.selectedFile = event.target.files.item(0);
    reader.readAsDataURL(event.target.files[0]);
    this.profilePicLabel.nativeElement.innerText = this.selectedFile.name;
  }

}
