import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Community, CommunityService } from '../community.service';
import { PostComponent } from '../post/post.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommunitySidebarComponent } from '../community-sidebar/community-sidebar.component';
import { AppToastService, ToastType } from '../app-toast.service';

@Component({
  selector: 'app-community',
  standalone: true,
  template: `
    <div class="row">
      <div class="col-2">
        <app-community-sidebar />
      </div>
      <div class="col">
        <router-outlet />
      </div>
      <div class="col-2" *ngIf="community">
        <div class="row align-items-center justify-content-between">
          <div class="col">
            <h1>{{ community.name }}</h1>
          </div>
        </div>
        <p>{{ community.description }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./community.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    PostComponent,
    CommunitySidebarComponent,
  ],
})
export class CommunityComponent implements OnInit {
  community?: Community;

  constructor(
    private communityService: CommunityService,
    private route: ActivatedRoute,
    private toastService: AppToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.communityService.getCommunity(params.get('name') || '').subscribe({
        next: (community) => {
          this.community = community;
        },
        error: () => {
          this.toastService.show('Community not found', ToastType.Danger);
        },
      });
    });
  }
}
