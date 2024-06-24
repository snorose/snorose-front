import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BLUE1 } from '../../../../../shared/consts/color';

@Component({
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrl: './scrap.component.scss'
})
export class ScrapComponent {

  @Input() scrapCount: number = 0;
  @Output() click = new EventEmitter<{ isScrap: boolean }>();

  public BLUE1 = BLUE1;

  public isScrap: boolean = false;

  public clickScrap() {
    this.isScrap = !this.isScrap;
    this.click.emit({ isScrap: this.isScrap });
  }
  
}
