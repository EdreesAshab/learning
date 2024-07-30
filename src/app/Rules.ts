import { type Rule } from './models/Rule.model';

export const PasswordRules: Rule[] = [
  {
    id: 0,
    message: 'Minimum length (8)',
    rule: (password: string) => {
      return password.length >= 8;
    },
  },
  {
    id: 1,
    message: 'Must include at least 1 upperCase letter',
    rule: (password: string) => {
      return /[A-Z]/.test(password);
    },
  },
  {
    id: 2,
    message: 'Must include at least 1 lowerCase letter',
    rule: (password: string) => {
      return /[a-z]/.test(password);
    },
  },
  {
    id: 3,
    message: 'Must include at least 1 number',
    rule: (password: string) => {
      return /\d/.test(password);
    },
  },
  {
    id: 4,
    message: 'Must include at least 1 special character',
    rule: (password: string) => {
      return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
    },
  },
  {
    id: 5,
    message: 'Must not include the userName or email',
    rule: (password: string, userName: string, email: string) => {
      return (
        !password.toLowerCase().includes(userName) &&
        !password.toLowerCase().includes(email.toLowerCase().split('@')[0])
      );
    },
  },
];
