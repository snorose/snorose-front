import { Component } from '@angular/core';
import { BLUE2, BLUE3 } from '../../shared/consts/color';

export interface IKeyValue {
  key: string;
  value: any;
}

declare global {

  interface Array<T> {
    last(): any;
    first(): any;
    isEmpty(): boolean;
  }

}

Array.prototype.last = function () {
  return this[this.length - 1];
}

Array.prototype.first = function () {
  return this[0];
}

Array.prototype.isEmpty = function () {
  if (this.length === 0) return true;
  else return false;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'snorose';

  public BLUE2 = BLUE2;
  public BLUE3 = BLUE3;

}
