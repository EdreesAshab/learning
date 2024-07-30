import { Rule } from './Rule.model';

export interface PasswordValidatorOptions {
  rules: Rule[];
  userName: string;
  email: string;
}
