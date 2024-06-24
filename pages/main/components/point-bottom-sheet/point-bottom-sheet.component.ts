import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { GlobalService } from '../../../../shared/services/global.service';
import { DalService } from '../../../../shared/services/dal.service';
import { POINT_CATEGORY, POINT_SOURCE } from '../../../../shared/data/point.data';
import { MembershipService } from '../../../../shared/services/membership.service';

@Component({
  selector: 'app-point-bottom-sheet',
  templateUrl: './point-bottom-sheet.component.html',
  styleUrl: './point-bottom-sheet.component.scss'
})
export class PointBottomSheetComponent {

  constructor(
    public globalService: GlobalService,
    private readonly dalService: DalService,
    private readonly membershipService: MembershipService,
    private _bottomSheetRef: MatBottomSheetRef<PointBottomSheetComponent>,
  ) { }

  public getPoint(event: any) {
    event.preventDefault();
    // 포인트 적립 로직
    // 하루에 한번만 적립하도록 예외 처리
    const request = {
      userId: this.membershipService.getUser()?.userId as number,
      category: POINT_CATEGORY.Attendance,
      source: POINT_SOURCE.Attendance
    };
    this.dalService.pointHttp.fluctuate(request).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dalService.snackBar(`${response.result.difference} 포인트가 적립되었습니다!`);
          this.globalService.point = response.result.balance;
          console.log('getPoint', this.globalService.point);
          
          this._bottomSheetRef.dismiss({
            isChecked: true
          });
        }
        else {
          this.dalService.snackBar(response.message);
        }
      },
      error: (error) => {
        this.dalService.snackBar('서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요');
      }
    });
  }

  public closeBottomSheet(event: any) {
    this._bottomSheetRef.dismiss({
      isChecked: false
    });
  }
}
