import { Component, inject } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { Router, RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { ToastsComponent } from './toasts/toasts.component';
import { AppToastService, ToastType } from './app-toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./app.component.scss'],
  template: `
    <main>
      <app-toasts aria-live="polite" aria-atomic="true"></app-toasts>
      <nav
        class="navbar navbar-expand-lg bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Blurp</a>
          <div class="collapse navbar-collapse">
            <div class="navbar-nav ms-auto">
              <a
                *ngIf="!jwtHelper.isTokenExpired()"
                class="nav-link"
                [routerLink]="[
                  '/user',
                  loginService.getLoggedInUser()?.username
                ]"
              >
                Profile ({{ loginService.getLoggedInUser()?.username }})
              </a>
              <a
                *ngIf="jwtHelper.isTokenExpired()"
                class="nav-link"
                [routerLink]="['/login']"
              >
                Login
              </a>
              <a
                *ngIf="!jwtHelper.isTokenExpired()"
                (click)="onLogoutClick()"
                class="nav-link"
                href="#"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
      <section class="container-fluid mt-3">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  imports: [HomeComponent, RouterModule, CommonModule, ToastsComponent],
})
export class AppComponent {
  title = 'Blurp';

  constructor(
    public jwtHelper: JwtHelperService,
    public loginService: LoginService,
    private router: Router,
    private toastService: AppToastService
  ) {}

  onLogoutClick() {
    this.loginService.logout();
    this.toastService.show('Logged out succesfully!', ToastType.Success);
    this.router.navigate(['/']);
  }
}
