import { Pipe, PipeTransform } from '@angular/core';
import { LectureType } from '../../../shared/http/review.http';

@Pipe({
  name: 'lectureType'
})
export class LectureTypePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case LectureType.MajorRequired:
        return '전공필수';
      case LectureType.MajorElective:
        return '전공선택';
      case LectureType.GeneralRequired:
        return '교양필수';
      case LectureType.GeneralElective:
        return '교양선택';
      case LectureType.Other:
        return '기타';
      default:
        return value;
    }
  }
}
