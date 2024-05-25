import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'full1Date'
})
export class DatePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const date = new Date(value);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}.${month}.${day}`;
  }

}
