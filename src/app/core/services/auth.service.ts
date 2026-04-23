import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://127.0.0.1:5001/atom-challenge-a52c7/us-central1/api';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(): void {
    this.http
      .post(`${this.apiUrl}/auth/login`, {}, { withCredentials: true })
      .subscribe();
    this.router.navigate(['/tasks']);
  }

  createUser(email: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/users`,
      { email },
      { withCredentials: true },
    );
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }
}
