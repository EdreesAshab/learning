import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

import { PasswordValidatorOptions } from '../models/PasswordValidatorOptions.model';
import { type Rule } from '../models/Rule.model';

import { PasswordRules } from '../Rules';

@Directive({
  selector: '[appPasswordValidator]',
  standalone: true,
})
export class PasswordValidatorDirective {
  @Input() appPasswordValidator?: PasswordValidatorOptions = {
    rules: PasswordRules,
    userName: 'ali',
    email: 'lenovo@email.com',
  };

  password: string;
  userName: string;
  email: string;
  rules: Rule[] = [];
  invalidRules: Rule[] = [];
  div: any = null;
  ul: any = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.rules = this.appPasswordValidator!.rules;
    this.userName = this.appPasswordValidator!.userName;
    this.email = this.appPasswordValidator!.email;
  }

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

  checkPassword() {
    this.invalidRules = [];

    for (let rule of this.rules) {
      if (
        rule.id === 5 &&
        !rule.rule(this.password, this.userName, this.email)
      ) {
        this.invalidRules.push(rule);
      } else if (rule.id !== 5 && !rule.rule(this.password)) {
        this.invalidRules.push(rule);
      }
    }

    return this.invalidRules.length === 0;
  }

  @HostListener('input', ['$event.target.value']) onChange(value: string) {
    this.password = value;
    this.checkPassword();

    this.ul.replaceChildren();

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
