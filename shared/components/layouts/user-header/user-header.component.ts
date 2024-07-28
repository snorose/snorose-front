import { Component, Input } from '@angular/core';
import { BLUE1 } from '../../../consts/color';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {

  @Input() userDisplay: string = '';

  public BLUE1 = BLUE1;
  public userDisplayStyle = {
    width: '30%',
    height: '10px'
  }

}
