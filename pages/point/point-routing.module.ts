import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointComponent } from './point.component';

export const routes: Routes = [
  {
    path: '',
    component: PointComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointRoutingModule { }