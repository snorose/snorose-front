import { AfterViewInit, Directive, ElementRef, ViewChild, inject } from "@angular/core";
import { ScrollService } from "../services/scroll.service";

@Directive()
export abstract class ScrollAbstract implements AfterViewInit {

  @ViewChild('listDiv', { read: ElementRef<HTMLDivElement>, static: true }) listDiv!: ElementRef<HTMLDivElement>;

  protected scrollService = inject(ScrollService);

  protected scrollPosition: number = 0;
  protected page: number = 0;

  public isLoading: boolean = true;

  ngAfterViewInit() {
    this.moveScrollPosition();
  }

  private moveScrollPosition() {
    this.listDiv.nativeElement.scrollTop = this.scrollPosition;
  }

  protected handleRouter() {}

  protected loadData() {}

  public onNearEndScroll() {}

}