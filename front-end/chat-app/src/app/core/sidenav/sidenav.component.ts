import { Component, OnInit, Inject } from "@angular/core";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalVaribale } from '../services/global.service';


declare let mLayout: any;
@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.css"]
})
export class SideNavComponent implements OnInit {
  isSuperAdmin: boolean = false;
  userRole: string = "";
  trial;
  plan: string;
  showMaps: boolean = false;
  loggedInFromSuperAdmin: boolean;
  constructor(
    private _router: Router,
  ) { }
  ngOnInit() {
    this.isSuperAdmin =
      localStorage.getItem(GlobalVaribale.userRole) == "superAdmin";
    this.userRole = localStorage.getItem(GlobalVaribale.userRole);
    this.loggedInFromSuperAdmin = JSON.parse(localStorage.getItem(GlobalVaribale.loggedInFromSuperAdmin)) ? true : false;
    this.trial = JSON.parse(localStorage.getItem(GlobalVaribale.trialExpired));
    this.plan = localStorage.getItem(GlobalVaribale.subscriptionPlan);
  }
  liteUserTrigger() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    swalWithBootstrapButtons.fire({
      title: 'Upgrade Subscription Plan',
      text: `Upgrade to Premuim plan to use this feature.`,
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes Upgrade',
      cancelButtonText: 'No Cancel It',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        $(".subscribe a").trigger('click');
        $('.subPlanUpdate-Section').removeAttr('hidden');
      }
    }).catch(error => {
      Swal.fire(error.message)
    })

  }
}
