import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board.component';
import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { BoardPostComponent } from './components/board-post/board-post.component';
import { authGuard } from '../../shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  {
    path: ':boardId',
    component: BoardListComponent,
    canActivate: [authGuard]
  },
  {
    path: ':boardId/post',
    component: BoardPostComponent,
    canActivate: [authGuard]
  },
  {
    path: ':boardId/:postId',
    component: BoardDetailComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }