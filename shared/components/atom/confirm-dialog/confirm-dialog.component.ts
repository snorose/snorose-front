import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface IConfirmDialog {
  title: string;
  content: string;
  btnYes: string;
  btnNo: string;
  isBtnDisabled: boolean;
  isDisableClose: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  public title: string;
  public content: string;
  public btnYes: string;
  public btnNo: string;
  public isBtnDisabled: boolean;

  constructor(
    private dialogRef: MatDialogRef<IConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmDialog
  ) {
    this.title = data.title;
    this.content = data.content;
    this.btnYes = data.btnYes;
    this.btnNo = data.btnNo;
    this.isBtnDisabled = data.isBtnDisabled ?? false;
    this.dialogRef.disableClose = data.isDisableClose ?? false;
  }

  public onClickNo() {
    this.dialogRef.close(false);
  }

  public onClickYes() {
    this.dialogRef.close(true);
  }

}
