import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router, RouterModule } from '@angular/router';
import { AppToastService, ToastType } from '../app-toast.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container-xxl">
      <form [formGroup]="loginForm" (submit)="login()">
        <div class="mb-3">
          <label for="username" class="form-label">User name</label>
          <input
            type="text"
            class="form-control"
            placeholder="User name"
            formControlName="username"
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            formControlName="password"
            class="form-control"
          />
        </div>

        <button type="submit" class="btn btn-primary">Login</button>
        <button class="btn btn-link" [routerLink]="['/register']">
          Register
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./loginpage.component.scss'],
})
export class LoginpageComponent {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastService: AppToastService,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit() {
    if (!this.jwtHelper.isTokenExpired()) {
      this.router.navigate(['/community/test']);
    }
  }

  login() {
    this.loginService
      .login(
        this.loginForm.value.username ?? '',
        this.loginForm.value.password ?? ''
      )
      .subscribe({
        complete: () => {
          this.toastService.show('Logged in succesfully', ToastType.Success);
          this.router.navigate(['/community/test']);
        },
        error: (err) => this.toastService.show(err.message, ToastType.Danger),
      });
  }
}
