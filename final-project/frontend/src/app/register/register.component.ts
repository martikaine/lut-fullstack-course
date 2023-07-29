import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { AppToastService, ToastType } from '../app-toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-xxl">
      <form (ngSubmit)="onSubmit()" [formGroup]="registerForm">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            formControlName="username"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            formControlName="email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            formControlName="password"
            required
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="registerForm.invalid"
        >
          Register
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private toastService: AppToastService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.registerForm.valid) return;

    const form = this.registerForm.value;

    this.loginService
      .register(form.username!, form.email!, form.password!)
      .subscribe({
        complete: () => {
          this.toastService.show(
            'Registered succesfully! Please login with your credentials.',
            ToastType.Success
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          this.toastService.show(err.message, ToastType.Danger);
        },
      });
  }
}
