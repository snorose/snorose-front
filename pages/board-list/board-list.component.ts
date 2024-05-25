import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../shared/services/global.service';
import { announcements, communityList, departmentList, Section } from './consts/board';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.scss'
})
export class BoardListComponent implements OnInit {

  public announcements: Section[] = [];
  public communityList: Section[] = [];
  public departmentList: Section[] = [];

  constructor(public globalService: GlobalService) { }

  ngOnInit() {
    console.log('BoardListComponent oninit');
    this.announcements = announcements;
    this.communityList = communityList;
    this.departmentList = departmentList;
  }

  public clickBoard(event: any) {
    console.log('clickBoard');
  }
}
