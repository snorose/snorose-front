import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { IKeyValue } from '../../../../src/app/app.component';
import { IControl, IFormGroup, IGroup, FormService, IValidation } from '../../../services/form.service';
import { CustomValidator } from '../../../classes/custom-validator';

export const _filter = (opt: string[], value: string) => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().includes(filterValue));
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {

  @Input() key: string = 'sign-up';

  public isLoading: boolean = true;
  public formData: (IControl | IFormGroup)[] = [];
  public dynamicMultiForm!: FormGroup;
  private customValidator = new CustomValidator();
  public groupOptions: Observable<IGroup[]>[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public formService: FormService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.formService.getFormStructure().subscribe((d: IKeyValue[]) => {
      this.formData = d.find((item: IKeyValue) => item.key === this.key)?.value;

      let entireGroup: { [key: string]: any } = {};
      this.formData.forEach((control: IControl | IFormGroup) => {
        // 그룹 폼일 때,
        if (control.category === 'group') {
          let formGroup: { [key: string]: any } = {};

          (control as IFormGroup).controls.forEach(groupControl => {
            let validators: ValidatorFn[] = [];
            if (groupControl.validations != null) {
              validators = this.addValidation(groupControl.validations);
            }
            formGroup[groupControl.name] = [groupControl.value || '', validators];
          });

          entireGroup[control.name] = this.formBuilder.group(formGroup);
        }
        // 단일 폼일 때,
        else {
          let validators: ValidatorFn[] = [];
          if (control.validations != null) {
            validators = this.addValidation(control.validations);
          }
          entireGroup[control.name] = [control.value || '', validators];
        }
      });

      this.dynamicMultiForm = this.formBuilder.group(entireGroup);

      this.formData.forEach((control: IControl | IFormGroup) => {
        if (control.category === 'select') {
          this.groupOptions.push(
            this.dynamicMultiForm.get(control.name)!.valueChanges.pipe(
              startWith(''),
              map(value => this.filterGroup(control.group as IGroup[], value || ''))
            )
          );
        }
      });

      this.isLoading = false;
    });
  }

  private filterGroup(currentGroup: IGroup[], value: string): IGroup[] {
    if (value) {
      return currentGroup
        .map(group => ({ main: group.main, sub: _filter(group.sub, value) }))
        .filter(group => group.sub.length > 0);
    }
    return currentGroup;
  }

  private addValidation(validations: IValidation[]): ValidatorFn[] {
    let controlValidators: ValidatorFn[] = [];
    if (validations) {
      validations.forEach((validation: IValidation) => {
        if (validation.validator === 'required') controlValidators.push(Validators.required);
        if (validation.validator === 'email') controlValidators.push(Validators.email);
        if (validation.validator == 'email-domain') controlValidators.push(this.customValidator.emailDomain())
        if (validation.validator.startsWith('maxLength')) controlValidators.push(this.customValidator.maxLength(validation.validator));
        if (validation.validator.startsWith('minLength')) controlValidators.push(this.customValidator.minLength(validation.validator));
        if (validation.validator === 'password') controlValidators.push(this.customValidator.password());
        if (validation.validator === 'password-match') controlValidators.push(this.customValidator.passwordMatch());
        if (validation.validator === 'koreanEnglish') controlValidators.push(this.customValidator.koreanEnglish());
        if (validation.validator === 'textPattern') controlValidators.push(this.customValidator.textPattern());
      });
    }
    return controlValidators;
  }

  public onSubmit() {
    console.log('ngSubmit valid', this.dynamicMultiForm.valid);
    console.log('ngSubmit', this.dynamicMultiForm.value);
  }

  public isIFormGroup(control: IControl): control is IFormGroup {
    return (control as IFormGroup).controls !== undefined;
  }


}
