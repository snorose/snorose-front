import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PointBottomSheetComponent } from '../point-bottom-sheet/point-bottom-sheet.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DalService } from '../../../../shared/services/dal.service';
import { MembershipService } from '../../../../shared/services/membership.service';
import { POINT_SOURCE } from '../../../../shared/data/point.data';

export interface IAttendanceDialog {
  title: string;
  btnNo: string;
}

@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrl: './attendance-dialog.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class AttendanceDialogComponent implements OnInit {

  public title: string;
  public btnNo: string;

  public selected!: Date | null;
  public currentDate: Date = new Date();

  constructor(
    private _bottomSheet: MatBottomSheet,
    public dialogRef: MatDialogRef<IAttendanceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IAttendanceDialog,
    private readonly dalService: DalService,
    private readonly membershipService: MembershipService,
  ) {
    this.title = data.title;
    this.btnNo = data.btnNo;
  }
  ngOnInit(): void {
    // this.dalService.pointHttp.get()
  }

  onClickNo(): void {
    this.dialogRef.close();
  }

  dateClass() {
    // 지금까지 포인트 모은 날을 배열로 가지고 있다가, 뿌리기
    //const dateInMilliseconds = date.getTime();
    // if (date.getDate() === 1) { // 매월 1일 체크
    //   return 'special-day';
    // }

    return; // 다른 날짜에는 아무런 클래스도 적용하지 않음
  }

  public selectDate(event: any) {
    const currentDateWithoutTime = new Date(this.currentDate.setHours(0, 0, 0, 0)).toLocaleDateString();
    const specificDateWithoutTime = new Date(event.setHours(0, 0, 0, 0)).toLocaleDateString();

    // 오늘과 같은 날짜면 포인트! 획득
    if (currentDateWithoutTime === specificDateWithoutTime) {
      this.openBottomSheet();
      return;
    }
    return;
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(PointBottomSheetComponent, { disableClose: true });
    bottomSheetRef.afterDismissed().subscribe(d => {
      if (d.isChecked) {
        this.dalService.pointHttp.add({
          userId: this.membershipService.getUser()?.userRoleId as number,
          difference: 1,
          category: '출석체크',
          source: POINT_SOURCE.Attendance
        }).subscribe(response => {
          // 달력에 표시
          this.selected = this.currentDate;
        })
      }
    });
  }

}
