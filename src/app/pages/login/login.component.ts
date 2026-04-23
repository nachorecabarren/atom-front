import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  showCreateDialog: boolean = false;
  pendingEmail: string = '';

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const email = this.loginForm.value.email;

    this.authService
      .findUserByEmail(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.user) {
            this.authService.setLoggedIn();
            this.router.navigate(['/tasks']);
          } else {
            this.pendingEmail = email;
            this.showCreateDialog = true;
          }
        },
        error: () => {
          this.isLoading = false;
          this.pendingEmail = email;
          this.showCreateDialog = true;
        },
      });
  }

  onConfirmCreate(): void {
    this.isLoading = true;
    this.authService
      .createUser(this.pendingEmail)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.authService.setLoggedIn();
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onCancelCreate(): void {
    this.showCreateDialog = false;
    this.pendingEmail = '';
  }
}
