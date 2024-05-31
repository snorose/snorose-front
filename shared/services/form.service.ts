import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';

export interface IValidation {
  name: string;
  validator: string;
  message: string;
}

export interface IGroup {
  main: string;
  sub: string[];
}

export interface IStyle {
  layout?: any;
  label?: any;
  input?: any;
  textarea?: any;
  password?: any;
  radioButton?: any;
}

export interface IControl {
  category: string;
  type: string;
  label?: string;
  name: string;
  value?: any;
  group?: IGroup[]; // select type을 위한 group
  placeholder?: string;
  validations?: IValidation[],
  styles?: IStyle;
}

export interface IFormGroup extends IControl {
  controls: IControl[];
}

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private readonly httpService = inject(HttpService);

  public getFormStructure() {
    return this.httpService.GetJson('./assets/json/form.json');
  }

}
