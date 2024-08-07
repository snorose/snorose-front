import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { DalService } from '../../../../shared/services/dal.service';
import { ActivatedRoute } from '@angular/router';
import { IReviewGetData, LectureType, Semester } from '../../../../shared/http/review.http';
import { LayoutService } from '../../../../shared/services/layout.service';
import { ScrollService } from '../../../../shared/services/scroll.service';
import { IAddPointRequest } from '../../../../shared/http/point.http';
import { MembershipService } from '../../../../shared/services/membership.service';
import { POINT_CATEGORY, POINT_SOURCE } from '../../../../shared/data/point.data';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.scss'
})
export class ReviewDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);
  private scrollService = inject(ScrollService);
  private readonly membershipService = inject(MembershipService);
  private globalService = inject(GlobalService);

  public postId: string | null = null;
  public isLoading: boolean = true;

  public review: IReviewGetData = {
    userDisplay: '송이',
    title: '제목',
    content: '내용 입니다',

    // 게시물 정보
    viewCount: 0,
    scrapCount: 0,
    likeCount: 0,
    createdAt: '2024-01-21',

    // 강의 정보
    lectureName: '강의명',
    professor: '교수님 성함',
    classNumber: 1,
    lectureYear: 2024,
    semester: Semester.First,
    lectureType: LectureType.GeneralElective,
    isPF: false,
    isEdited: false,

    // 파일 정보
    fileName: 'file.pdf'
  };

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('postId');
    if (this.postId == null) {
      this.dalService.snackBar('해당 게시물을 찾을 수 없습니다');
      return;
    }

    this.isLoading = true;
    this.dalService.reviewHttp.getDetail(this.postId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.review = response.result;
          // this.review.fileName = 'file.pdf'; // 지워야함!!!!
          this.isLoading = false;
        }
        else {
          this.dalService.snackBar('해당 게시물의 상세정보를 찾을 수 없습니다');
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  }

  public download(event: any) {
    // 파일 다운로드
    this.postId = this.route.snapshot.paramMap.get('postId');
    if (this.postId == null) {
      this.dalService.snackBar('해당 게시물을 찾을 수 없습니다');
      return;
    }

    const pointData: IAddPointRequest = {
      userId: this.membershipService.getUser()?.userId as number,
      category: POINT_CATEGORY.Exam_Review_Download,
      sourceId: Number(this.postId),
      source: POINT_SOURCE.Review
    };

    this.dalService.reviewHttp.download(this.postId, this.review.fileName).subscribe({
      next: (response) => {
        console.log('download response', response);
        if (response) {
          const blob = new Blob([response.body!], { type: response.headers.get('content-type')! });
          const linkEl = document.createElement('a');
          linkEl.style.display = 'none';
          
          const url = window.URL.createObjectURL(blob);
          linkEl.href = url;
          linkEl.download = `${this.review.fileName}`;
          document.body.appendChild(linkEl);
          linkEl.click();
          document.body.removeChild(linkEl);
          window.URL.revokeObjectURL(url);

          this.dalService.pointHttp.fluctuate(pointData).subscribe({
            next: (response) => {
              this.dalService.snackBar(`${response.result.difference} 포인트가 적립되었습니다!`);
              this.globalService.point = response.result.balance;
            },
            error: (error) => {
              this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
            }
          });
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  }

  public goBack(): void {
    this.scrollService.reviewState.isBack = true;
    this.location.back();
  }

}
