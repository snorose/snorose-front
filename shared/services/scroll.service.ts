import { Injectable } from '@angular/core';
import { IBoardListData } from '../http/board.http';
import { IReviewListData } from '../http/review.http';

interface IBoardState {
  id: string;
  isBack: boolean;
}

interface IBoardStorage {
  boardList: IBoardListData[];
  page: number;
  scrollPosition: number;
}

interface IReviewStorage {
  reviewList: IReviewListData[];
  page: number;
  scrollPosition: number;
}

@Injectable()
export class ScrollService {

  public boardState: IBoardState[] = [
    {
      id: '2',
      isBack: false
    },
    {
      id: '3',
      isBack: false
    },
    {
      id: '4',
      isBack: false
    },
    {
      id: '5',
      isBack: false
    },
    {
      id: '6',
      isBack: false
    }
  ];

  public reviewState: { isBack: boolean } = { isBack: false };

  public currentScrollTop: number = 0;

  public boardStorage: IBoardStorage = {
    boardList: [],
    page: 0,
    scrollPosition: 0
  }

  public reviewStorage: IReviewStorage = {
    reviewList: [],
    page: 0,
    scrollPosition: 0
  };

}