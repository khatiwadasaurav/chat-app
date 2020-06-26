import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector: "app-baat-chit",
    templateUrl: "./baat-chit.component.html",
    encapsulation: ViewEncapsulation.None
})
export class BaatChit implements OnInit {

    ngOnInit(): void {
        this.reloadAllOpenTabs();
    }

    reloadAllOpenTabs() {
        window.addEventListener('storage', e => {
            if (localStorage.length == 0) {
                window.location.reload();
                setTimeout(v => {
                    localStorage.clear();
                }, 2000)
            }
        })
    }
}