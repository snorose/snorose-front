import { Pipe, PipeTransform } from '@angular/core';
import { Semester } from '../../../shared/http/review.http';

@Pipe({
  name: 'semester'
})
export class SemesterPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case Semester.First:
        return '1학기';
      case Semester.Second:
        return '2학기';
      case Semester.Summer:
        return '여름학기';
      case Semester.Winter:
        return '겨울학기';
      case Semester.Other:
        return '기타';
      default:
        return value;
    }
  }

}
