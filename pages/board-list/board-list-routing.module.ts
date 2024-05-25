import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardListComponent } from './board-list.component';
import { BoardComponent } from './components/board/board.component';
import { DetailComponent } from './components/detail/detail.component';
import { PostComponent } from '../post/post.component';

export const routes: Routes = [
  {
    path: '',
    component: BoardListComponent
  },
  {
    path: 'board/:name/:boardId',
    component: BoardComponent
  },
  {
    path: ':name/post/new',
    component: PostComponent
  },
  {
    path: 'board/:name/:boardId/:postId',
    component: DetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardListRoutingModule { }