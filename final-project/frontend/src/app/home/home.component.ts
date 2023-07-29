import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityComponent } from '../community/community.component';
import { LoginpageComponent } from '../loginpage/loginpage.component';
import { CommunitySidebarComponent } from '../community-sidebar/community-sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="position-absolute top-50 start-50 translate-middle">
      <div class="container-lg">
        <div class="row">
          <div class="col">
            <h1>Blurp</h1>
            <h4 class="fst-italic">
              "Out of the many social media platforms across the Internet, this
              is definitely one of them"
            </h4>
          </div>
          <div class="col-4 align-self-center">
            <app-loginpage></app-loginpage>
          </div>
        </div>
      </div>
    </div>
    <footer class="position-absolute bottom-0 start-50 translate-middle-x mb-3">
      (c) Matti Martikainen, 2023
    </footer>
  `,
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    CommunityComponent,
    CommunitySidebarComponent,
    LoginpageComponent,
  ],
})
export class HomeComponent {}
