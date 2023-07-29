import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-arrows',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex flex-column text-center me-3">
      <a class="cursor-pointer" (click)="upvote()">
        <i
          *ngIf="state === 'up'"
          class="bi bi-arrow-up-square-fill text-primary fs-4"
        ></i
        ><i *ngIf="state !== 'up'" class="bi bi-arrow-up-square fs-4"></i>
      </a>

      <span class="text fs-5">{{ votes }}</span>
      <a class="cursor-pointer" (click)="downvote()">
        <i
          *ngIf="state === 'down'"
          class="bi bi-arrow-down-square-fill text-danger fs-4"
        ></i>
        <i *ngIf="state !== 'down'" class="bi bi-arrow-down-square fs-4"></i>
      </a>
    </div>
  `,
  styleUrls: ['./vote-arrows.component.scss'],
})
export class VoteArrowsComponent {
  @Input() state: 'up' | 'down' | undefined;
  @Input() votes!: number;
  @Output() voteEvent = new EventEmitter<'up' | 'down'>();

  constructor() {}

  upvote() {
    this.voteEvent.emit('up');
  }

  downvote() {
    this.voteEvent.emit('down');
  }
}
