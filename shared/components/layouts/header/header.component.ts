import { Component, Input } from '@angular/core';
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

  public BLUE1 = BLUE1;

}
