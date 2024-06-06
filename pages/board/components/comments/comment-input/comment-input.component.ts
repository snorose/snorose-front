import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrl: './comment-input.component.scss'
})
export class CommentInputComponent {

  @ViewChild('textarea', { read: ElementRef, static: true }) textarea!: ElementRef;

  @Output() enter = new EventEmitter<any>();

  constructor(private renderer: Renderer2) {}

  public textareaChange() {
    const textarea = this.textarea.nativeElement;
    this.renderer.setStyle(textarea, 'height', 'auto');
    this.renderer.setStyle(textarea, 'height', `${this.textarea.nativeElement.scrollHeight}px`);
  }

  public textareaEnter(event: any, value: string) {
    if (event.isComposing) return;
    if (!value) return;
    event.preventDefault();

    this.enter.emit({ value });
    this.textarea.nativeElement.value = '';
  }

}
