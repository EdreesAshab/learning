import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-initial-circle',
  standalone: true,
  imports: [],
  templateUrl: './initial-circle.component.html',
  styleUrl: './initial-circle.component.css',
})
export class InitialCircleComponent {
  @Input() name: string;
  initials: string;

  ngOnInit() {
    let str = this.name.split(' ');
    this.initials =
      this.name.charAt(0).toUpperCase() +
      str[str.length - 1].charAt(0).toUpperCase();
  }
}
