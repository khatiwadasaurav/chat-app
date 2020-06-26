import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService, GlobalVaribale } from '../services/global.service';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { EventBusService, Events } from '../services/eventbus.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {

  public userName: string;
  public userEmail: string;
  public userPhoto: string;
  public fullName: string;
  public company: string;
  currentRoute = "";
  previousButtonHidden: boolean = true;
  clientId: string;
  userRole: string;
  trialDaysLeft;
  trial: boolean;
  userSubscriptionExpired: boolean;
  subscriptionPlan: string;
  headerMessage: string;
  loggedInFromSuperAdmin: boolean;
  path: string = '';
  superAdminId: string;
  testComponent: boolean;
  userBrainTreeId;
  cardExpiryDate;
  creditCardMessage: string;
  cardBoolean = false;
  dialog = localStorage.getItem(GlobalVaribale.dialogBoolean);
  eventBusSubscription: Subscription;
  emittedData: any;
  testData = {
    'subject': '001',
    'value': 'test'
  }
  constructor(

    private _router: Router,
    private _global: GlobalService,
    private _afauth: AngularFireAuth,
    private _eventBus: EventBusService,
    private _dataService: DataService

  ) {
  }
  ngOnInit() {
    // console.log(this.testData)
    this.userRole = localStorage.getItem(GlobalVaribale.userRole);
    this._global.refreshUser();
    this._afauth.authState.subscribe(currentUser => {
      if (currentUser) {
        this.userName = currentUser.displayName;
        this.userEmail = currentUser.email;
        this.userPhoto = currentUser.photoURL;
        this.fullName = currentUser.displayName;
        this.clientId = localStorage.getItem(GlobalVaribale.clientId);
      }
    })
    this._dataService.detailsChanged$.subscribe(data => {
      if (data) {
        // console.log(data);
        this.testData = data;
      }
    })
  }

  gotoProfile() {
    this._router.navigate(["./profile/view/"], {
      queryParams: { userId: this.clientId }
    });
  }
  logoutFunction() {

    console.log("here");
    this.path = "/logout"
    this._router.navigate([this.path]);
  }

  ngAfterViewInit() {
    this.headerButtonClick();
  }
  headerButtonClick() {
    jQuery(document).ready(function (e) {
      jQuery("input[name='plan']").click(function () {
        if (jQuery("#lite").is(":checked")) {
          jQuery(".premiumversion").hide();
          jQuery(".liteversion").show();
        } else {
          jQuery(".liteversion").hide();
          jQuery(".premiumversion").show();
        }
      });
      jQuery(".subMenu_open").click(function (e) {
        jQuery(this)
          .parents(".dropDown")
          .find(".submenu")
          .slideToggle();
        jQuery(this).toggleClass("active");
      });
      jQuery(".user_outer").click(function (e) {
        if (
          jQuery(this)
            .parents(".he_user")
            .find(".userSubmenu")
            .css("display") == "none"
        ) {
          jQuery(this)
            .parents(".he_user")
            .find(".userSubmenu")
            .slideDown();
        } else {
          jQuery(this)
            .parents(".he_user")
            .find(".userSubmenu")
            .slideUp();
        }
      });
      jQuery(document).mouseup(function (e) {
        let obj: any;
        obj = e;
        var container = jQuery(".userSubmenu");
        if (
          !container.is(obj.target) &&
          container.has(obj.target).length == 0
        ) {
          container.slideUp();
        }
      });
      jQuery(".subscribe a").click(function (e) {
        e.preventDefault();
        jQuery(".body_overlay,.plan").addClass("active");
        jQuery("body").css("overflow", "hidden");
      });
      // jQuery(".closeplan").click(function(e){
      //     e.preventDefault();
      //     console.log("this is test");
      //     jQuery(".body_overlay,.plan").removeClass("active");
      //     jQuery("body").css("overflow-y","auto");
      // });
      jQuery(".tiggle_menu").click(function (e) {
        jQuery(".slidebar").toggleClass("active");
      });
      function readURL(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            let obj: any;
            obj = e.target;
            jQuery(".addPicture").hide();
            jQuery(".edirPicture").show();
            jQuery("#imagePreview").css(
              "background-image",
              "url(" + obj.result + ")"
            );
            jQuery("#imagePreview").hide();
            jQuery("#imagePreview").fadeIn(650);
          };
          reader.readAsDataURL(input.files[0]);
        }
      }
      jQuery("#imageUpload").change(function () {
        readURL(this);
      });

      jQuery(".tab_list a").click(function (e) {
        e.preventDefault();
        jQuery(".tab_list li").removeClass("active");
        jQuery(this)
          .parents("li")
          .addClass("active");
        var thisID = jQuery(this).attr("href");
        var thisIDArray = thisID.split("#");
        jQuery(".tab_info").hide();
        jQuery("#" + thisIDArray[1]).fadeIn();
      });
      jQuery(".open_model").click(function (e) {
        jQuery(".overlay_popup").addClass("active");
        jQuery("body").css("overflow", "hidden");
        jQuery(".model_popup").fadeIn(700);
      });
      jQuery(".close_popup").click(function (e) {
        jQuery(".overlay_popup").removeClass("active");
        jQuery("body").css("overflow-y", "auto");
        jQuery(".model_popup").fadeOut(700);
      });
      jQuery(document).mouseup(function (e) {
        let obj: any;
        obj = e;
        var container = jQuery(".model_popup");
        if (
          !container.is(obj.targobjet) &&
          container.has(obj.target).length === 0
        ) {
          jQuery(".overlay_popup").removeClass("active");
          jQuery("body").css("overflow-y", "auto");
          jQuery(".model_popup").fadeOut(700);
        }
      });
    });
  }
  goBack() {
    window.history.back();
  }
  hideDialog() {
    this.cardBoolean = false;
    localStorage.setItem(GlobalVaribale.dialogBoolean, "false");
  }
}

