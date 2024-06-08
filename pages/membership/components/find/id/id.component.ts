import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { DalService } from '../../../../../shared/services/dal.service';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrl: './id.component.scss'
})
export class IdComponent {

  private readonly dalService = inject(DalService);
  private readonly location = inject(Location);

  public onSubmit(event: any) {
    console.log('onSubmit', event);
  }

  public goBack(): void {
    this.location.back();
  }

}
