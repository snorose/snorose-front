import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {

  @Input() threshold = 50;
  @Output() nearEnd = new EventEmitter<void>();

  private el: HTMLElement;

  constructor(private elementRef: ElementRef) { 
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.addEventListener('scroll', this.onScroll.bind(this));
  }
  
  ngOnDestroy() {
    this.el.removeEventListener('scroll', this.onScroll.bind(this));
  }

  private onScroll() {
    const scrollTop = this.el.scrollTop;
    const scrollHeight = this.el.scrollHeight;
    const offsetHeight = this.el.offsetHeight;
    const scrollPosition = scrollTop + offsetHeight;

    if (scrollHeight - scrollPosition < this.threshold) {
      this.nearEnd.emit();
    }
  }

}
