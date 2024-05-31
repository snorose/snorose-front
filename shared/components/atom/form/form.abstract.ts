import { Directive, inject, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormService, IControl, IFormGroup } from "../../../services/form.service";

@Directive()
export abstract class FormAbstract {

  public readonly formService = inject(FormService);

  @Input() control!: IControl | IFormGroup;
  @Input() dynamicForm!: FormGroup;

  public getErrorMessage(control: IControl | IFormGroup, groupControl: IControl | null) {
    if (groupControl == null) {
      const formControl = this.dynamicForm.get(control.name);
      if (control.validations == null) return '';

      for (let validation of control.validations) {
        if (formControl?.hasError(validation.name)) {
          return validation.message;
        }
      }
      return '';
    }
    else {
      const formGroupControl = this.dynamicForm.get(control.name)?.get(groupControl.name);
      if (groupControl.validations == null) return '';

      for (let validation of groupControl.validations) {
        if (formGroupControl?.hasError(validation.name)) {
          return validation.message;
        }
      }
      return '';
    }
  }

}