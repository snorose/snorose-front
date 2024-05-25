import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { GlobalService } from '../../../../shared/services/global.service';
import { DalService } from '../../../../shared/services/dal.service';

@Component({
  selector: 'app-point-bottom-sheet',
  templateUrl: './point-bottom-sheet.component.html',
  styleUrl: './point-bottom-sheet.component.scss'
})
export class PointBottomSheetComponent {

  constructor(
    public globalService: GlobalService,
    private readonly dalService: DalService,
    private _bottomSheetRef: MatBottomSheetRef<PointBottomSheetComponent>
  ) { }

  public getPoint(event: any) {
    event.preventDefault();
    // 포인트 적립 로직
    // 하루에 한번만 적립하도록 예외 처리
    this.globalService.point++;
    this.dalService.snackBar('포인트가 적립되었습니다!');
    console.log('getPoint', this.globalService.point);
    this._bottomSheetRef.dismiss({
      isChecked: true
    });
  }

  public closeBottomSheet(event: any) {
    this._bottomSheetRef.dismiss({
      isChecked: false
    });
  }
}
