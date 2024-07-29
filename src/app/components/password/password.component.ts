import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { UsersService } from '../../services/users.service';

import { PasswordValidatorDirective } from '../../directives/password-validator.directive';

import { PasswordValidatorOptions, User } from '../../types';

import { PasswordRules } from '../../Rules';

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

  currentUser: User;

  subscription: Subscription;

  options: PasswordValidatorOptions;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.subscription = this.usersService.currentUser$.subscribe(
      (currentUser) => {
        this.currentUser = currentUser;
        this.options = {
          rules: PasswordRules,
          userName: this.currentUser.userName,
          email: this.currentUser.email,
        };
      }
    );
  }

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
