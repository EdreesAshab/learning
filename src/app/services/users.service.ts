import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { type User } from '../models/User.model';

import { Users } from '../Users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  user: User = Users[Math.floor(Math.random() * Users.length)];

  private currentUserSubject = new BehaviorSubject<User>(this.user);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  currentUser(): void {
    this.currentUserSubject.next(this.user);
  }
}
