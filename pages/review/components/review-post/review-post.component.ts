import { Component, ViewChild, inject } from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/components/moleclues/dynamic-form/dynamic-form.component';
import { DalService } from '../../../../shared/services/dal.service';
import { LayoutService } from '../../../../shared/services/layout.service';
import { IReviewCreateRequest } from '../../../../shared/http/review.http';
import { MembershipService } from '../../../../shared/services/membership.service';

@Component({
  selector: 'app-review-post',
  templateUrl: './review-post.component.html',
  styleUrl: './review-post.component.scss'
})
export class ReviewPostComponent {

  private readonly dalService = inject(DalService);
  public readonly layoutService = inject(LayoutService);
  private readonly membershipService = inject(MembershipService);

  @ViewChild(DynamicFormComponent) dynamicFormComponent!: DynamicFormComponent;

  public post() {
    console.log('review post', this.dynamicFormComponent.dynamicForm.value);
    if (!this.dynamicFormComponent.dynamicForm.valid) {
      this.dalService.snackBar('필수 정보를 모두 입력해 주세요');
      return;
    }

    const value = this.dynamicFormComponent.dynamicForm.value;
  }

}
