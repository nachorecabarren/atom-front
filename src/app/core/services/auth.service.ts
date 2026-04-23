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
  // private readonly apiUrl =
  //   'http://127.0.0.1:5001/atom-challenge-a52c7/us-central1/api';
  private readonly apiUrl = "/api";


  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  findUserByEmail(email: string): Observable<{ user: User | null }> {
    return this.http.get<{ user: User | null }>(
      `${this.apiUrl}/users/${email}`,
    );
  }

  createUser(email: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/users`,
      { email },
    );
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/auth/logout`, {})
      .subscribe();
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  setLoggedIn(): void {
    localStorage.setItem('isLoggedIn', 'true');
  }
}
