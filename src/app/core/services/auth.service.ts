import { Injectable, DestroyRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private readonly apiUrl =
  //   'http://127.0.0.1:5001/atom-challenge-a52c7/us-central1/api';
  private readonly apiUrl = '/api';
  private currentUser: User | null = null;
  private destroyRef = inject(DestroyRef);

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
    return this.http.post<User>(`${this.apiUrl}/users`, { email });
  }

  logout(): void {
    this.http
      .post('/auth/logout', {})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => console.error('Error during logout'),
      });
    this.currentUser = null;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  setLoggedIn(): void {
    localStorage.setItem('isLoggedIn', 'true');
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
