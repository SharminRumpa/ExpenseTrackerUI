import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

    form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);


  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.form.getRawValue() as any).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 409 ? 'An account with this email already exists.' : 'Something went wrong. Please try again.'
        );
      }
    });
  }
}