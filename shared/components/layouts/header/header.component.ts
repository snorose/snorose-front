import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BLUE1 } from '../../../consts/color';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input() icon: string = '';
  @Input() name: string = '';
  @Input() link: string = '';
  @Input() rightButton: string | null = null;

  @Output() clickLeft = new EventEmitter<any>();
  @Output() clickRight = new EventEmitter<any>();

  public BLUE1 = BLUE1;

  public clickLeftButton() {
    this.clickLeft.emit();
  }

  public clickRightButton() {
    this.clickRight.emit();
  }

}
