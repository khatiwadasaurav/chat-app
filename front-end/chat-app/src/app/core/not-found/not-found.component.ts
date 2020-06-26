import { OnInit, Component, ViewEncapsulation } from "@angular/core";


@Component({
    selector: '.not-found-wrapper',
    templateUrl: './not-found.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class NotFoundComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }
}