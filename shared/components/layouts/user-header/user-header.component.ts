import { Component, Input } from '@angular/core';
import { BLUE1 } from '../../../consts/color';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {

  @Input() userDisplay: string = '송이';

  public BLUE1 = BLUE1;

}
