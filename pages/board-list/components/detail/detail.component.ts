import { Component, OnInit } from '@angular/core';
import { DalService } from '../../../../shared/services/dal.service';
import { ActivatedRoute } from '@angular/router';
import { IBoardDetailData } from '../../../../shared/http/board.http';
import { LayoutService } from '../../../../shared/services/layout.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  public detailData: IBoardDetailData = {
    postId: 1,
    userId: 1,
    userDisplay: '송이',
    title: '글 제목',
    content: '글 내용 입니다. 글 내용 입니다. 글 내용 입니다. 글 내용 입니다.',
    viewCount: 0,
    likeCount: 0,
    scrapCount: 0,
    reportCount: 0,
    createdAt: '2024-01-31',
    updatedAt: '2024-01-31',
    visible: true,
    category: null,
    edited: false,
    notice: false
  };

  public boardId: string | null = null;
  public postId: string | null = null;
  public name: string = '';

  constructor(
    private route: ActivatedRoute,
    private readonly dalService: DalService,
    private readonly layoutService: LayoutService,
  ) { }

  ngOnInit() {
    this.layoutService.isShowHeader = false;
    this.boardId = this.route.snapshot.paramMap.get('boardId');
    this.postId = this.route.snapshot.paramMap.get('postId');
    console.log('boardId', this.boardId, 'postId', this.postId);

    if (this.boardId == null || this.postId == null) {
      this.dalService.snackBar('해당 post가 존재하지 않습니다.');
    }
    this.dalService.boardHttp.getBoardDetail(this.boardId as string, this.postId as string).subscribe(response => {
      console.log('detail response', response);
      this.detailData = response.result;
    });
  }

}
