import { Component, inject } from '@angular/core';
import { DalService } from '../../../../../shared/services/dal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss'
})
export class PasswordComponent {

  private readonly router = inject(Router);
  private readonly dalService = inject(DalService);

  public onSubmit(event: any) {
    console.log('onSubmit', event);
  }

  public goBack(): void {
    this.router.navigate(['/signIn']);
  }
  
}
