import { NgModule } from '@angular/core';
import { BoardComponent } from './board.component';
import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { BoardRoutingModule } from './board-routing.module';
import { BoardListComponent } from './components/board-list/board-list.component';
import { LikeComponent } from './components/buttons/like/like.component';
import { ChatComponent } from './components/buttons/chat/chat.component';
import { ScrapComponent } from './components/buttons/scrap/scrap.component';
import { CommentComponent } from './components/comments/comment/comment.component';
import { CommentInputComponent } from './components/comments/comment-input/comment-input.component';
import { BoardPostComponent } from './components/board-post/board-post.component';
import { ListComponent } from './components/list/list.component';



@NgModule({
  declarations: [
    BoardComponent,
    BoardListComponent,
    BoardDetailComponent,
    LikeComponent,
    ChatComponent,
    ScrapComponent,
    CommentComponent,
    CommentInputComponent,
    BoardPostComponent,
    ListComponent,
  ],
  imports: [
    BoardRoutingModule,
    SharedModule,
  ]
})
export class BoardModule { }
