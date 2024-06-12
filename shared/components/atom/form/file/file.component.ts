import { Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { DalService } from './../../../../services/dal.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent {

  @ViewChild('fileInput', { read: ElementRef<HTMLInputElement>, static: true }) fileInput!: ElementRef<HTMLInputElement>;

  private readonly dalService = inject(DalService);

  public name: string = '';
  private selectedFile: File | null = null;

  @Output() file = new EventEmitter<File>();

  public uploadFile() {
    if (this.selectedFile) {
      // 파일 업로드 
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }
    else {
      this.dalService.snackBar('파일을 추가해 주세요');
    }
  }

  public selectFileInput(event: any) {
    const input = event.target;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      if (this.selectedFile == null) {
        this.dalService.snackBar('파일을 추가해 주세요');
        return;
      }

      if (this.selectedFile.type !== 'application/pdf') {
        this.dalService.snackBar('파일은 pdf만 가능합니다');
        this.name = '';
        return;
      }

      this.file.emit(this.selectedFile);
      this.name = input.files[0].name;
    }
  }

  public clickSelect(event: any) {
    this.fileInput.nativeElement.click();
  }

}
