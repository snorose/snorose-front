import { AfterViewInit, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PointBottomSheetComponent } from './components/point-bottom-sheet/point-bottom-sheet.component';
import { DalService } from '../../shared/services/dal.service';
import { LayoutService } from '../../shared/services/layout.service';
import { DateService } from '../../shared/services/date.service';
import { BLUE1 } from '../../shared/consts/color';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceDialogComponent } from './components/attendance-dialog/attendance-dialog.component';
import { BOARDS } from '../board/consts/board';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  public selected!: Date | null;
  public currentDate!: Date;
  public BLUE1 = BLUE1;
  public BOARDS = BOARDS;

  constructor(
    private dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private readonly dalService: DalService,
    private readonly dateService: DateService,
    public readonly layoutService: LayoutService,
  ) {
    this.currentDate = this.dateService.getCurrentDate();
  }

  // ngOnInit() {
  //   // 현재 날짜에 포인트 체크했는지 체크 후, 달력에 보여주기
  // }

  public attendanceCheck(event: any) {
    console.log('attendanceCheck', event);
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      data: {
        title: '출석체크',
        btnNo: '닫기'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  dateClass() {
    // 지금까지 포인트 모은 날을 배열로 가지고 있다가, 뿌리기
    //const dateInMilliseconds = date.getTime();
    // if (date.getDate() === 1) { // 매월 1일 체크
    //   return 'special-day';
    // }

    return; // 다른 날짜에는 아무런 클래스도 적용하지 않음
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(PointBottomSheetComponent);
    bottomSheetRef.afterDismissed().subscribe(d => {
      if (d.isChecked) {
        // 달력에 표시

      }

    });
  }

  public selectDate(event: any) {
    const currentDateWithoutTime = new Date(this.currentDate.setHours(0, 0, 0, 0)).toLocaleDateString();
    const specificDateWithoutTime = new Date(event.setHours(0, 0, 0, 0)).toLocaleDateString();

    if (currentDateWithoutTime === specificDateWithoutTime) {
      this.openBottomSheet();
      return;
    }
    return;
  }
  // 오늘과 같지 않으면 클릭 disabled

  // 오늘과 같은 날짜면 포인트! 획득
}
