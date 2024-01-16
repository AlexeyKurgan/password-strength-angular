import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBER_OF_INDICATORS, INPUT_MIN_LENGTH, DIGITS_REGEX, LETTERS_REGEX, SYMBOLS_REGEX } from "../constants/constants";
import { PasswordStrengthEnum } from '../enums/password-strength.enum';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent {
  private readonly numberOfIndicators = NUMBER_OF_INDICATORS;
  passwordForm: FormGroup;
  indicatorsArray: number[] = Array.from(
    { length: this.numberOfIndicators },
    (_, index) => index + 1,
  );
 
  public statusClass = 'default';
  public isShowInputValue: boolean = false;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(INPUT_MIN_LENGTH)]],
    });
  }

  getPasswordStrengthClass(status: PasswordStrengthEnum): string {
    switch (status) {
      case PasswordStrengthEnum.WeakCorrect:
        return 'weak-correctly';
      case PasswordStrengthEnum.WeakNotCorrect:
        return 'weak';
      case PasswordStrengthEnum.Medium:
        return 'medium';
      case PasswordStrengthEnum.Strong:
        return 'strong';
      default:
        return 'default';
    }
    return 'default';
  }

  private getPasswordStrength(password: string) {
    const passwordLength = password.length;
    const hasLetters = LETTERS_REGEX.test(password);
    const hasDigits = DIGITS_REGEX.test(password);
    const hasSymbols = SYMBOLS_REGEX.test(password);

    if (password === '') {
      return PasswordStrengthEnum.Default;
    }

    if (passwordLength < 8 && password !== '') {
      return PasswordStrengthEnum.WeakNotCorrect;
    }

    if (hasLetters && hasDigits && hasSymbols) {
      return PasswordStrengthEnum.Strong;
    }

    if (
      (hasLetters && hasSymbols) ||
      (hasLetters && hasDigits) ||
      (hasDigits && hasSymbols)
    ) {
      return PasswordStrengthEnum.Medium;
    }

    if (hasLetters || hasDigits || hasSymbols) {
      return PasswordStrengthEnum.WeakCorrect;
    }

    return PasswordStrengthEnum.Default;
  }

  get inputType() {
    return this.isShowInputValue ? 'text' : 'password';
  }

  showInputValue() {
    this.isShowInputValue = !this.isShowInputValue;
  }

  ngOnInit() {
    this.passwordForm.controls['password'].valueChanges.subscribe((value) => {
      const enumResult = this.getPasswordStrength(value);
      this.statusClass = this.getPasswordStrengthClass(enumResult);
    });
  }
}
