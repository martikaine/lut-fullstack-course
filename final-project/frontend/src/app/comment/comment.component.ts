import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteArrowsComponent } from '../vote-arrows/vote-arrows.component';
import { Comment } from '../community.service';
import { RouterModule } from '@angular/router';
import { CommentEditorComponent } from '../comment-editor/comment-editor.component';

export interface CommentVoteEvent {
  id: string;
  direction: 'up' | 'down';
}

@Component({
  selector: 'app-comment',
  standalone: true,
  template: `
    <div class="row">
      <div class="card mt-2">
        <div class="card-body">
          <div class="d-flex">
            <div>
              <app-vote-arrows
                [state]="comment.voteStatus"
                [votes]="comment.votes"
                (voteEvent)="handleVote($event)"
              />
            </div>
            <div class="flex-grow-1">
              <p class="card-text">
                <small class="text-muted">
                  <a
                    [routerLink]="['/user', comment.author.username]"
                    (click)="$event.stopPropagation()"
                  >
                    {{ comment.author.username }}
                  </a>
                  on
                  {{ comment.createdAt | date : 'short' }}
                </small>
              </p>
              <p class="card-text">{{ comment.content }}</p>
              <button
                *ngIf="!showReplyBox"
                class="btn btn-outline-secondary"
                (click)="showReply()"
              >
                Reply
              </button>
              <app-comment-editor
                *ngIf="showReplyBox"
                [parentCommentId]="comment._id"
                [showCancelButton]="true"
                (onCommentAdded)="handleComment()"
                (onCancel)="handleCancel()"
              />
            </div>
          </div>
        </div>
        <app-comment
          *ngFor="let child of comment.children"
          [comment]="child"
          (onVote)="passVoteEventUpwards($event)"
          (onReplyAdded)="passReplyEventUpwards($event)"
          class="row ms-5"
        />
      </div>
    </div>
  `,
  styleUrls: ['./comment.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    VoteArrowsComponent,
    CommentEditorComponent,
  ],
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Output() onReplyAdded = new EventEmitter<string | null>();
  @Output() onVote = new EventEmitter<CommentVoteEvent>();
  showReplyBox: boolean = false;

  showReply() {
    this.showReplyBox = true;
  }

  handleComment() {
    this.showReplyBox = false;
    this.onReplyAdded.emit();
  }

  handleCancel() {
    this.showReplyBox = false;
  }

  handleVote(direction: 'up' | 'down') {
    this.onVote.emit({ id: this.comment._id, direction });
  }

  // Pass the events up the nested chain of comment components
  // so that they reach the top-level comment's parent component
  passVoteEventUpwards(event: CommentVoteEvent) {
    this.onVote.emit(event);
  }

  passReplyEventUpwards(event: string | null) {
    this.onReplyAdded.emit(event);
  }
}
