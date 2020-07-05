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
  constructor(
    private _router: Router,
  ) { }
  ngOnInit() {
    this.userRole = localStorage.getItem(GlobalVaribale.userRole);
  }
  
}
