import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { UiService } from '../services/ui.service';

@Directive({
  selector: '[appNameInitialsCircle]',
  standalone: true,
})
export class NameInitialsCircleDirective {
  @Input() appNameInitialsCircle: string;

  initials: string;

  subscription: Subscription;

  language: string;

  textSize: number;

  span: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private uiService: UiService,
    private cdf: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;

      if (this.span) {
        this.cdf.detectChanges();

        this.checkLanguage();

        this.getInitials();

        this.span.replaceChildren();

        const initials = this.renderer.createText(this.initials);

        this.renderer.appendChild(this.span, initials);
      }
    });

    this.subscription = this.uiService.textSize$.subscribe((textSize) => {
      this.textSize = textSize;

      if (this.span) this.checkTextSize();
    });
  }

  getInitials() {
    let str = this.appNameInitialsCircle.split(' ');
    this.initials =
      this.appNameInitialsCircle.charAt(0).toUpperCase() +
      str[str.length - 1].charAt(0).toUpperCase();
  }

  ngAfterViewInit() {
    this.getInitials();

    this.span = this.renderer.createElement('span');

    this.checkLanguage();
    this.checkTextSize();

    const initials = this.renderer.createText(this.initials);

    this.renderer.appendChild(this.span, initials);

    const parent = this.el.nativeElement.parentNode;
    this.renderer.insertBefore(parent, this.span, this.el.nativeElement);
  }

  checkLanguage() {
    if (this.language === 'Ar') {
      this.renderer.addClass(this.span, 'initialsCircleAr');
      this.renderer.removeClass(this.span, 'initialsCircleEn');
    } else {
      this.renderer.addClass(this.span, 'initialsCircleEn');
      this.renderer.removeClass(this.span, 'initialsCircleAr');
    }
  }

  checkTextSize() {
    if (this.textSize === 1) {
      this.renderer.addClass(this.span, 'initialsCircleNormalSize');
      this.renderer.removeClass(this.span, 'initialsCircleLargeSize');
    } else {
      this.renderer.addClass(this.span, 'initialsCircleLargeSize');
      this.renderer.removeClass(this.span, 'initialsCircleNormalSize');
    }
  }
}
