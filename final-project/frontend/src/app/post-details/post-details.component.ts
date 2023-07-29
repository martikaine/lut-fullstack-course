import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityService, Post, Comment } from '../community.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VoteArrowsComponent } from '../vote-arrows/vote-arrows.component';
import { CommentEditorComponent } from '../comment-editor/comment-editor.component';
import { PostComponent } from '../post/post.component';
import {
  CommentComponent,
  CommentVoteEvent,
} from '../comment/comment.component';

@Component({
  selector: 'app-post-details',
  standalone: true,
  template: `
    <app-post *ngIf="post" [post]="post"></app-post>
    <app-comment-editor></app-comment-editor>
    <app-comment
      *ngFor="let comment of comments"
      [comment]="comment"
      (onReplyAdded)="fetchComments()"
      (onVote)="handleVoteComment($event)"
    />
  `,
  styleUrls: ['./post-details.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    VoteArrowsComponent,
    CommentEditorComponent,
    PostComponent,
    CommentComponent,
  ],
})
export class PostDetailsComponent implements OnInit {
  post: Post | undefined;
  comments: Comment[] | undefined;
  postId!: string;

  constructor(
    private communityService: CommunityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('id') || '';

      this.communityService.getPost(this.postId).subscribe({
        next: (post) => (this.post = post),
      });

      this.communityService.getComments(this.postId).subscribe({
        next: (comments) => (this.comments = comments),
      });
    });
  }

  vote(direction: 'up' | 'down') {
    this.communityService.votePost(this.post!._id, direction).subscribe({
      complete: () =>
        this.communityService.getPost(this.post!._id).subscribe({
          next: (post) => (this.post = post),
        }),
    });
  }

  fetchComments() {
    this.communityService.getComments(this.postId).subscribe({
      next: (comments) => (this.comments = comments),
    });
  }

  handleVoteComment(event: CommentVoteEvent) {
    this.communityService
      .voteComment(this.post!._id, event.id, event.direction)
      .subscribe({ complete: () => this.fetchComments() });
  }
}
