import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { BLUE1 } from '../../../../../shared/consts/color';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrl: './comment-input.component.scss'
})
export class CommentInputComponent {

  @ViewChild('textarea', { read: ElementRef, static: true }) textarea!: ElementRef;

  @Output() enter = new EventEmitter<any>();

  public BLUE1 = BLUE1;
  public commentText: string = '';

  public autoResize() {
    const textarea = this.textarea.nativeElement;
    if (textarea) {
      textarea.style.height = '46px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  public expandTextarea() {
    const textarea = this.textarea.nativeElement;
    if (textarea) {
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  public shrinkTextarea() {
    const textarea = this.textarea.nativeElement;
    if (textarea) {
      textarea.style.height = '46px';
    }
  }

  public submitComment(event: any, value: string) {
    if (event.isComposing) return;
    if (!value) return;
    event.preventDefault();
    event.stopPropagation();

    const textarea = this.textarea.nativeElement;
    
    this.enter.emit({ value });
    this.textarea.nativeElement.value = '';
    textarea.style.height = '46px';
  }

}
