import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollTopService {

    constructor() { }

    scrollToTop() {
        let scrollToTop = window.setInterval(() => {
            let pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 20);
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 16);
    }
}
