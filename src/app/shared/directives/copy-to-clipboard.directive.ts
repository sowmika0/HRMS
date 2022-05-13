import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

// import { ClipboardService } from 'ngx-clipboard';

@Directive({
    selector: '[copyToClipboard]',
    inputs: [
        'code:code'
    ]
})
export class CopyToClipboardDirective {
    @Input() code: string;

    constructor(
        private elRef: ElementRef,
        private renderer: Renderer2,
        // private _clipboardService: ClipboardService,
    ) {
    }

    ngOnInit() {
    }

    @HostListener('click')
    onClick() {
        const target: any = event.target || event.srcElement || event.currentTarget;
        // this._clipboardService.copyFromContent(this.code);
        target.innerHTML = 'Copied...';
        setTimeout(() => {
            target.innerHTML = 'Copy';
        }, 4000);
    }

}
