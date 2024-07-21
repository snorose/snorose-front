import { NgModule } from '@angular/core';
import { PointComponent } from './point.component';
import { PointRoutingModule } from './point-routing.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    PointComponent
  ],
  imports: [
    SharedModule,
    PointRoutingModule
  ]
})
export class PointModule { }
