import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityService } from '../community.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comment-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="mt-2" (ngSubmit)="addComment()" [formGroup]="commentForm">
      <textarea
        name="content"
        formControlName="content"
        class="form-control mb-2"
        id="commentContent"
        placeholder="Add your comment..."
        required
      ></textarea>
      <div class="row mb-3">
        <div class="col">
          <button type="submit" class="btn btn-primary">Submit</button>
          <button class="btn btn-link">Cancel</button>
        </div>
      </div>
    </form>
  `,
  styleUrls: ['./comment-editor.component.scss'],
})
export class CommentEditorComponent {
  @Input() parentCommentId!: string | null;
  @Output() onCommentAdded = new EventEmitter<string | null>();
  commentForm = this.formBuilder.group({
    content: [''],
  });
  postId = '';

  constructor(
    private communityService: CommunityService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => (this.postId = params.get('id') || '')
    );
  }

  addComment(): void {
    this.communityService
      .addComment(
        this.postId,
        this.parentCommentId,
        this.commentForm.value.content || ''
      )
      .subscribe(
        (response) => {
          this.commentForm.reset();
          this.onCommentAdded.emit(this.parentCommentId);
        },
        (error) => console.error('Error:', error)
      );
  }
}
