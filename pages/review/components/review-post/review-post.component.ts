import { Component, ViewChild, inject } from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/components/moleclues/dynamic-form/dynamic-form.component';
import { DalService } from '../../../../shared/services/dal.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { MembershipService } from '../../../../shared/services/membership.service';
import { Router } from '@angular/router';
import { IReviewCreateRequest, LectureType, Semester } from '../../../../shared/http/review.http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/atom/confirm-dialog/confirm-dialog.component';
import { IAddPointRequest } from '../../../../shared/http/point.http';
import { POINT_CATEGORY, POINT_SOURCE } from '../../../../shared/data/point.data';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-review-post',
  templateUrl: './review-post.component.html',
  styleUrl: './review-post.component.scss'
})
export class ReviewPostComponent {

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);
  private readonly membershipService = inject(MembershipService);
  private globalService = inject(GlobalService);

  @ViewChild(DynamicFormComponent) dynamicFormComponent!: DynamicFormComponent;

  private selectedFile: File | null = null;

  public post() {
    console.log('review post', this.dynamicFormComponent.dynamicForm.value);
    if (!this.dynamicFormComponent.dynamicForm.valid) {
      this.dalService.snackBar('필수 정보를 모두 입력해 주세요');
      return;
    }

    if (this.selectedFile == null) {
      this.dalService.snackBar('파일을 추가해 주세요');
      return;
    }

    const value = this.dynamicFormComponent.dynamicForm.value;
    const postRequest: IReviewCreateRequest = {
      boardId: 1,
      userDisplay: this.membershipService.getUser()?.nickname as string,
      category: null,
      title: value.lectureName,
      content: value.content,
      lectureName: value.lectureName,
      professor: value.professor,
      classNumber: value.classNumber ?? null,
      lectureYear: Number(value.lectureYear),
      semester: this.convertSemester(value.semester),
      hasMidterm: value.hasMidterm,
      hasFinalterm: value.hasFinalterm,
      lectureType: this.convertLectureType(value.lectureType),
      isPF: value.isPF,
      file: this.selectedFile
    };

    this.dalService.reviewHttp.create(postRequest).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          const pointData: IAddPointRequest = {
            userId: this.membershipService.getUser()?.userId as number,
            category: POINT_CATEGORY.Exam_Review_Create,
            // sourceId: Number(this.postId), // TODOS postId 추가해야함!!!
            source: POINT_SOURCE.Review
          };
          this.dalService.pointHttp.fluctuate(pointData).subscribe({
            next: (response) => {
              this.dalService.snackBar(`${response.result.difference} 포인트가 적립되었습니다!`);
              this.globalService.point = response.result.balance;
              this.router.navigate([`/review`]); // TODOS reviewId 추가해야함!!!
            },
            error: (error) => {
              this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
            }
          });
        }
        else {
          this.dalService.snackBar(response.message);
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    })

  }

  public uploadFile(file: File) {
    console.log('uploadFile', file);
    this.selectedFile = file;
  }

  public closePost() {
    if (this.dynamicFormComponent.dynamicForm.touched) {
      const dialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: '작성 삭제',
          content: '작성중인 시험 후기를 삭제할까요?',
          btnYes: '삭제',
          btnNo: '취소'
        }
      });

      dialog.afterClosed().subscribe(result => {
        if (!result) return;
        this.router.navigate(['/review']);
      });
    }
    else {
      this.router.navigate(['/review']);
    }
  }

  private convertSemester(semester: string): Semester {
    switch (semester) {
      case '1학기':
        return Semester.First;
      case '2학기':
        return Semester.Second;
      case '여름학기':
        return Semester.Summer;
      case '겨울학기':
        return Semester.Winter;
      case '기타':
        return Semester.Other;
      default:
        return Semester.Other;
    }
  }

  private convertLectureType(lectureType: string): LectureType {
    switch (lectureType) {
      case '전공필수':
        return LectureType.MajorRequired;
      case '전공선택':
        return LectureType.MajorElective;
      case '교양필수':
        return LectureType.GeneralRequired;
      case '교양선택':
        return LectureType.GeneralElective;
      case '기타':
        return LectureType.Other;
      default:
        return LectureType.Other;
    }
  }

}
