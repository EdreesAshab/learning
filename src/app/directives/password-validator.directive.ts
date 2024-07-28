import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Rule } from '../types';

@Directive({
  selector: '[appPasswordValidator]',
  standalone: true,
})
export class PasswordValidatorDirective {
  password: string;
  userName: string = 'edrees15';
  email: string = 'edrees@email.com';
  invalidRules: Rule[] = [];
  div: any = null;
  ul: any = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.div = this.renderer.createElement('div');
    this.renderer.setStyle(this.div, 'display', 'none');
    this.renderer.addClass(this.div, 'invalidPasswordModel');

    const text = this.renderer.createText('PASSWORD NOT ALLOWED');

    const h4 = this.renderer.createElement('h4');
    this.renderer.appendChild(h4, text);

    this.ul = this.renderer.createElement('ul');

    this.renderer.appendChild(this.div, h4);
    this.renderer.appendChild(this.div, this.ul);

    const parent = this.el.nativeElement.parentNode;
    this.renderer.insertBefore(
      parent,
      this.div,
      this.el.nativeElement.nextSibling
    );
  }

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

  @HostListener('input', ['$event.target.value']) onChange(value: string) {
    this.password = value;
    this.checkPassword();

    while (this.ul.firstChild) {
      this.renderer.removeChild(this.ul, this.ul.firstChild);
    }

    if (this.div && this.invalidRules.length) {
      this.renderer.setStyle(this.div, 'display', 'block');
      for (let rule of this.invalidRules) {
        const li = this.renderer.createElement('li');
        const ruleMessage = this.renderer.createText(rule.message);
        this.renderer.appendChild(li, ruleMessage);
        this.renderer.appendChild(this.ul, li);
      }
    } else if (this.invalidRules.length === 0)
      this.renderer.setStyle(this.div, 'display', 'none');
  }
}
