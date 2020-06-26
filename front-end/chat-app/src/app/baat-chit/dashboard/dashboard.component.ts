import { OnInit, Component, ViewEncapsulation } from '@angular/core';
import { GlobalVaribale } from 'src/app/core/services/global.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {
  userRole;

  ngOnInit(): void {
    this.userRole = localStorage.getItem(GlobalVaribale.userRole);
    console.log("inside the dashboard component");
  }

}