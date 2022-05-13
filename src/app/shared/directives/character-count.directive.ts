import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[characterCount]',
  inputs: [
    'characterLimit:characterLimit'
  ]
})
export class CharacterCountDirective {
  @Input() characterLimit: number;

  private defaultLimit: number = 200;
  private countDisplay: any;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.characterLimit = this.characterLimit || this.defaultLimit;
    this.countDisplay = this.renderer.createElement('div');
    const text = this.renderer.createText((this.elRef.nativeElement.value.length + ' / ' + this.characterLimit));
    this.renderer.addClass(this.countDisplay, 'character-count');
    this.renderer.appendChild(this.countDisplay, text);
    this.renderer.appendChild(this.elRef.nativeElement.parentElement, this.countDisplay);
  }

  @HostListener('keyup')
  onKeyUp() {
    if (this.elRef.nativeElement.value.length >= this.characterLimit) {
      this.renderer.addClass(this.countDisplay, 'limit-reached');
    } else {
      this.renderer.removeClass(this.countDisplay, 'limit-reached');
    }
    this.renderer.setProperty(this.countDisplay, 'innerHTML', (this.elRef.nativeElement.value.length + ' / ' + this.characterLimit));
  }

}
