import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

// Define type and use as literal type
export const EMAIL_DOMAIN_TYPE = {
  SM: 'sm.ac.kr',
  SOOKMYUNG: 'sookmyung.ac.kr'
} as const;
export type EMAIL_DOMAIN_TYPE = typeof EMAIL_DOMAIN_TYPE[keyof typeof EMAIL_DOMAIN_TYPE];

export class CustomValidator {

  public emailDomain(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.indexOf('@') !== -1) {
        const [_, domain] = control.value.split('@');

        if (!Object.values(EMAIL_DOMAIN_TYPE).includes(domain as EMAIL_DOMAIN_TYPE)) {
          return { domain: true };
        }
      }
      return null;
    }
  }

  public maxLength(maxLength: string): ValidatorFn {
    let [_, stringNum] = maxLength.split('-');
    let length = parseInt(stringNum, 10);

    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.length > length ? { maxLength: length } : null;
    }
  }

  public minLength(minLength: string) {
    let [_, stringNum] = minLength.split('-');
    let length = parseInt(stringNum, 10);

    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.length < length ? { minLength: length } : null;
    }
  }

  /**
   * 
   * @returns 
      최소 영어 대소문자, 숫자, 특수문자를 각각 하나 이상 포함한 8자 이상 16자 이하
      (0-9 하나이상 포함, a-zA-Z 하나 이상 포함, !@#$%^&* 하나 이상 포함)
      - minLength-8
      - maxLength-16
   */
  public password(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*]/.test(value);

      const passwordValid = (hasUpperCase || hasLowerCase) && hasNumeric && hasSpecialChar;
      return !passwordValid ? { password: true } : null;
    }
  }

  public passwordMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get('password')?.value;
      const confirmPassword = control.value;

      return password === confirmPassword ? null : { confirmPassword: true };
    }
  }

  public koreanEnglish(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const koreanEnglishPattern = /^[ㄱ-ㅎ가-힣a-zA-Z]+$/;
      const isValid = koreanEnglishPattern.test(control.value);
      return !isValid ? { koreanEnglish: true } : null;
    }
  }

  /**
   * 
   * 특수문자를 제외한 (ㄱ-ㅎ가-힣a-zA-Z0-9-_)
   */
  public textPattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const nicknamePattern = /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]+$/;
      const isValid = nicknamePattern.test(control.value);
      return !isValid ? { textPattern: true } : null;
    }
  }

}