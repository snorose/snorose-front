import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board.component';
import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { BoardListComponent } from './components/board-list/board-list.component';

export const routes: Routes = [
  {
    path: '',
    component: BoardComponent
  },
  {
    path: ':boardId',
    component: BoardListComponent
  },
  {
    path: ':boardId/:postId',
    component: BoardDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }