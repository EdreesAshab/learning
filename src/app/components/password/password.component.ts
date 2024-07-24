import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Rule } from '../../Rule';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, FormsModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css',
})
export class PasswordComponent {
  @Input() password: string;
  userName: string = 'edrees15';
  email: string = 'edrees@email.com';
  invalidRules: Rule[] = [];
  isHidden: string = 'password';
  showPasswordBtn: string = 'Show Password';

  rules: Rule[] = [
    {
      id: 0,
      message: 'Minimum length (8)',
      rule: () => {
        return this.password.length >= 8;
      },
    },
    {
      id: 1,
      message: 'Must include at least 1 upperCase letter',
      rule: () => {
        return /[A-Z]/.test(this.password);
      },
    },
    {
      id: 2,
      message: 'Must include at least 1 lowerCase letter',
      rule: () => {
        return /[a-z]/.test(this.password);
      },
    },
    {
      id: 3,
      message: 'Must include at least 1 number',
      rule: () => {
        return /\d/.test(this.password);
      },
    },
    {
      id: 4,
      message: 'Must include at least 1 special character',
      rule: () => {
        return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(this.password);
      },
    },
    {
      id: 5,
      message: 'Must not include the userName or email',
      rule: () => {
        return (
          !this.password.includes(this.userName) &&
          !this.password.includes(this.email.split('@')[0])
        );
      },
    },
  ];

  checkPassword() {
    this.invalidRules = [];

    for (let rule of this.rules) {
      if (!rule.rule()) {
        this.invalidRules.push(rule);
      }
    }

    return this.invalidRules.length === 0;
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
