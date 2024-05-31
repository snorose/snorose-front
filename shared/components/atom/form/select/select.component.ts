import { Component, Input } from '@angular/core';
import { FormAbstract } from '../form.abstract';
import { Observable } from 'rxjs';
import { IGroup, IControl, IFormGroup } from '../../../../services/form.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent extends FormAbstract {

  @Input() groupOptions: Observable<IGroup[]>[] = [];
  @Input() formStructure: (IControl | IFormGroup)[] = [];

  public getSelectIndex(name: string): number {
    const selects = this.formStructure.reduce((indices, item, index) => {
      if (item.category === 'select') {
        indices.push({
          name: item.name,
          index
        });
      }
      return indices;
    }, [] as { name: string; index: number; }[]);

    return selects.findIndex(item => item.name === name);
  }

}
