import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pf'
})
export class PfPipe implements PipeTransform {

  transform(value: boolean): string | boolean {
    switch (value) {
      case true:
        return 'O';
      case false:
        return 'X';
      default:
        return value;
    }
  }

}
