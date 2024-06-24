import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BLUE1 } from '../../../../../shared/consts/color';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrl: './like.component.scss'
})
export class LikeComponent {

  @Input() likeCount: number = 0;
  @Output() click = new EventEmitter<{ isLike: boolean }>();
  @Input() translate: { x: number; y: number; } = { x: 0, y: 0 };

  public BLUE1 = BLUE1;

  public isLike: boolean = false;

  public clickLike() {
    this.isLike = !this.isLike;
    this.click.emit({ isLike: this.isLike });
  }

}
