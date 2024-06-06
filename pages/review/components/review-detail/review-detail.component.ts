import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { DalService } from '../../../../shared/services/dal.service';
import { ActivatedRoute } from '@angular/router';
import { IReviewGetData, LectureType, Semester } from '../../../../shared/http/review.http';

@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.scss'
})
export class ReviewDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly dalService = inject(DalService);

  public postId: string | null = null;

  public reviewDetail: IReviewGetData = {
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

    // 파일 정보
    filePath: 'file.pdf',
    fileName: 'file.pdf'
  };

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('postId');
    if (this.postId == null) {
      this.dalService.snackBar('해당 게시물을 찾을 수 없습니다');
      return;
    }

    this.dalService.reviewHttp.getDetail(this.postId).subscribe(response => {
      if (response.isSuccess) {
        this.reviewDetail = response.result;
      }
      else {
        this.dalService.snackBar('해당 게시물의 상세정보를 찾을 수 없습니다');
      }
    });
  }

  public goBack(): void {
    this.location.back();
  }

}
