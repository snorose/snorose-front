import { Component, Input, OnInit } from '@angular/core';
import { PINK1 } from '../../../../shared/consts/color';
import { IReviewListData } from '../../../../shared/http/review.http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  @Input() list: IReviewListData[] = [];

  public PINK1 = PINK1;

  ngOnInit() {

  }

}
