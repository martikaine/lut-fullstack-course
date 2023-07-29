import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Community, CommunityService } from '../community.service';
import { AppToastService, ToastType } from '../app-toast.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-community-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<aside class="bd-sidebar">
    <div class="d-grid">
      <button
        [routerLink]="['/new-community']"
        type="button"
        class="btn btn-outline-primary"
      >
        + Create new community
      </button>
    </div>

    <a
      *ngFor="let community of communities"
      [routerLink]="['/community', community.name]"
      class="link-underline link-underline-opacity-0"
    >
      <div class="card mt-2">
        <div class="card-body">
          <h5 class="card-title">
            {{ community.name }}
          </h5>
          <p class="card-text">{{ community.description }}</p>
        </div>
      </div></a
    >
  </aside>`,
  styleUrls: ['./community-sidebar.component.scss'],
})
export class CommunitySidebarComponent implements OnInit {
  communities: Community[] = [];
  constructor(
    private communityService: CommunityService,
    private toastService: AppToastService
  ) {}

  ngOnInit() {
    this.communityService.getAllCommunities().subscribe({
      next: (communities) => {
        this.communities = communities;
      },
      error: () =>
        this.toastService.show('Could not load communities', ToastType.Danger),
    });
  }
}
