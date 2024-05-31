import { Component } from '@angular/core';
import { FormAbstract } from '../form.abstract';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent extends FormAbstract {

  public hide: boolean = true;

}
