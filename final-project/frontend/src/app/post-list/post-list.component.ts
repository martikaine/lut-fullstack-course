import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommunitySidebarComponent } from '../community-sidebar/community-sidebar.component';
import { CommunityService, PostsResponse } from '../community.service';
import { PostComponent, PostVoteEvent } from '../post/post.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PostComponent,
    CommunitySidebarComponent,
  ],
  template: `
    <div class="row mb-2">
      <div class="col ">
        <button class="btn btn-primary float-end" [routerLink]="['./new-post']">
          New post
        </button>
      </div>
    </div>
    <div *ngIf="posts && posts.posts.length > 0; else noPosts" #postList>
      <app-post
        *ngFor="let post of posts.posts"
        [post]="post"
        (voteEvent)="handleVote($event)"
        #postList
      ></app-post>
    </div>
    <ng-template #noPosts
      ><h2>There are no posts in this community.</h2>
      <p>Why not create one?</p></ng-template
    >
  `,
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent {
  communityService: CommunityService = inject(CommunityService);
  route: ActivatedRoute = inject(ActivatedRoute);
  posts: PostsResponse | undefined;
  communityName: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.communityName = params.get('name') || '';

      this.communityService
        .getAllPosts(this.communityName)
        .subscribe({ next: (posts) => (this.posts = posts) });
    });
  }

  handleVote(event: PostVoteEvent) {
    this.communityService.votePost(event.id, event.direction).subscribe({
      complete: () => this.updateVotesForPost(event.id),
    });
  }

  updateVotesForPost(id: string) {
    this.communityService.getPost(id).subscribe({
      next: (postToUpdate) => {
        const current = this.posts!;
        const updated: PostsResponse = {
          ...current,
          // Update the entry we just voted on
          posts: current.posts.map((oldPost) =>
            oldPost._id === postToUpdate._id ? postToUpdate : oldPost
          ),
        };

        this.posts = updated;
      },
    });
  }
}
