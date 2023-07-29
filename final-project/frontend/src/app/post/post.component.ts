import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../community.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VoteArrowsComponent } from '../vote-arrows/vote-arrows.component';

export interface VoteEvent {
  id: string;
  vote: 'up' | 'down';
}

@Component({
  selector: 'app-post',
  standalone: true,
  template: `
    <div class="card mb-2 cursor-pointer" (click)="handleClick()">
      <div class="card-body">
        <div class="row">
          <div class="col-1">
            <app-vote-arrows
              [state]="post.voteStatus"
              [votes]="post.votes"
              (voteEvent)="passVoteToParent($event)"
              (click)="$event.stopPropagation()"
              class="float-start"
            ></app-vote-arrows>
          </div>
          <div class="col float-start">
            <a
              [routerLink]="['post', post._id]"
              class="link-underline link-underline-opacity-0 link-dark"
              (click)="$event.stopPropagation()"
            >
              <h5 class="card-title">{{ post.title }}</h5>
            </a>
            <p class="card-text">{{ post.content }}</p>
            <p class="card-text">
              <small class="text-muted">
                Posted by
                <a
                  [routerLink]="['/user', post.author.username]"
                  (click)="$event.stopPropagation()"
                  >{{ post.author.username }}</a
                >
                on
                {{ post.createdAt | date : 'short' }}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./post.component.scss'],
  imports: [CommonModule, RouterModule, VoteArrowsComponent],
})
export class PostComponent {
  @Input() post!: Post;
  @Output() voteEvent = new EventEmitter<VoteEvent>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  handleClick() {
    console.log('click');
    this.router.navigate(['post', this.post._id], {
      relativeTo: this.route,
    });
  }

  passVoteToParent(vote: 'up' | 'down') {
    this.voteEvent.emit({ id: this.post._id, vote });
  }
}
