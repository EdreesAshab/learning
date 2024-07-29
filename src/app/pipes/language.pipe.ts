import { Pipe, PipeTransform } from '@angular/core';

import { Subscription } from 'rxjs';

import { UiService } from '../services/ui.service';

import langs from '../langs.json';

@Pipe({
  name: 'language',
  standalone: true,
  pure: false,
})
export class LanguagePipe implements PipeTransform {
  language: string;

  subscription: Subscription;

  constructor(private uiService: UiService) {
    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;
    });
  }

  transform(value: any, ...args: string[]): any {
    if (args[0] === 'langs')
      return langs[this.language as keyof Object][args[1] as keyof Object];

    return value[`Survey${args[0]}${this.language}`];
  }
}
