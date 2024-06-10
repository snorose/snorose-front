import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../../shared/services/layout.service';
import { MembershipService } from '../../../../shared/services/membership.service';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrl: './my-page.component.scss'
})
export class MyPageComponent {

  public readonly layoutService = inject(LayoutService);
  public readonly membershipService = inject(MembershipService);

}
