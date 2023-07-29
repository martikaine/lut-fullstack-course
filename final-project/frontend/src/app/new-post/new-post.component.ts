import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityService } from '../community.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastService, ToastType } from '../app-toast.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-lg">
      <form (ngSubmit)="onSubmit()" [formGroup]="postForm">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            class="form-control"
            id="title"
            formControlName="title"
            required
          />
        </div>
        <div class="mb-3">
          <label for="content" class="form-label">Content</label>
          <textarea
            class="form-control"
            id="content"
            formControlName="content"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="postForm.invalid"
        >
          Submit
        </button>
      </form>
    </div>
  `,
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  communityName: string = '';

  postForm = this.formBuilder.group({
    title: [''],
    content: [''],
  });

  constructor(
    private communityService: CommunityService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: AppToastService
  ) {}

  ngOnInit() {
    this.route.parent!.paramMap.subscribe((params) => {
      this.communityName = params.get('name') || '';
    });
  }

  onSubmit(): void {
    const { title, content } = this.postForm.value;

    this.communityService
      .addPost(this.communityName, title ?? '', content ?? '')
      .subscribe({
        next: (res) => {
          this.toastService.show('Post created!', ToastType.Success);
          this.router.navigate([`../post/${res._id}`], {
            relativeTo: this.route,
          });
        },
        error: () => {},
      });
  }
}
