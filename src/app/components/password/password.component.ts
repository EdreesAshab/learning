import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PasswordValidatorDirective } from '../../directives/password-validator.directive';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordValidatorDirective],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
})
export class PasswordComponent {
  isHidden: string = 'password';
  showPasswordBtn: string = 'Show Password';

  toggleShowPassword() {
    if (this.isHidden === 'password') {
      this.isHidden = 'text';
      this.showPasswordBtn = 'Hide Password';
    } else if (this.isHidden === 'text') {
      this.isHidden = 'password';
      this.showPasswordBtn = 'Show Password';
    }
  }
}
