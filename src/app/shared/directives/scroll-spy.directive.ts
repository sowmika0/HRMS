import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[scrollSpy]',
    host: { '(window:scroll)': 'track($event)' }
})
export class ScrollSpyDirective {
    @Input() public spiedTags = [];
    @Output() public sectionChange = new EventEmitter<string>();
    private currentSection: string;

    constructor(private _el: ElementRef) { }

    ngOnInit() {
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event: any) {
        let currentSection: string;
        let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
        const children = this._el.nativeElement.children;
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            if (this.spiedTags.some(spiedTag => spiedTag === element.tagName.trim().toLowerCase())) {
                if (element.offsetTop - 60 <= scrollTop && scrollTop <= element.offsetTop - 60 + element.offsetHeight) {
                    if (element.id) {
                        currentSection = element.id;
                        if (this.currentSection !== currentSection) {
                            this.currentSection = currentSection;
                            this.sectionChange.emit(this.currentSection);
                        }
                    }
                }
            }
        }

        if (!currentSection) {
            this.currentSection = undefined;
            this.sectionChange.emit(undefined);
        }
    }

    // @HostListener('window:scroll', ['$event'])
    // onScroll(event: any) {
    //     let currentSection: string;
    //     const children = this._el.nativeElement.children;
    //     const scrollTop = event.target.scrollTop;
    //     const parentOffset = event.target.offsetTop;
    //     console.log(this._el.nativeElement, this._el.nativeElement.offsetTop, event.target.scrollTop);
    //     for (let i = 0; i < children.length; i++) {
    //         const element = children[i];
    //         if (this.spiedTags.some(spiedTag => spiedTag === element.tagName)) {
    //             if ((element.offsetTop - parentOffset) <= scrollTop) {
    //                 currentSection = element.id;
    //             }
    //         }
    //     }
    //     if (currentSection !== this.currentSection) {
    //         this.currentSection = currentSection;
    //         this.sectionChange.emit(this.currentSection);
    //     }
    // }
}