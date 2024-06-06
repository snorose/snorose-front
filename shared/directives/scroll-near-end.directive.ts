import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]'
})
export class ScrollNearEndDirective {

  private readonly el = inject(ElementRef);

  @Input() threshold = 50;
  @Output() nearEnd = new EventEmitter<void>();

  @HostListener('window:scroll', ['$event.target'])
  public windowScrollEvent() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollPosition = scrollTop + clientHeight;
    
    if (scrollHeight - scrollPosition < this.threshold) {
      this.nearEnd.emit();
    }
  }

}
