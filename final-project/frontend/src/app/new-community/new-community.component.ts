import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityService } from '../community.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastService, ToastType } from '../app-toast.service';
import { CommunitySidebarComponent } from '../community-sidebar/community-sidebar.component';

@Component({
  selector: 'app-new-post',
  standalone: true,
  template: `
    <div class="row">
      <div class="col-2">
        <app-community-sidebar />
      </div>
      <div class="col">
        <form (ngSubmit)="onSubmit()" [formGroup]="postForm">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              formControlName="name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea
              class="form-control"
              id="description"
              formControlName="description"
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
      <div class="col-2"></div>
    </div>
  `,
  styleUrls: ['./new-community.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, CommunitySidebarComponent],
})
export class NewCommunityComponent implements OnInit {
  communityName: string = '';

  postForm = this.formBuilder.group({
    name: [''],
    description: [''],
  });

  constructor(
    private communityService: CommunityService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: AppToastService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => (this.communityName = params.get('name') || '')
    );
  }

  onSubmit(): void {
    const { name, description } = this.postForm.value;

    this.communityService
      .addCommunity(name ?? '', description ?? '')
      .subscribe({
        complete: () => {
          this.toastService.show('Community created!', ToastType.Success);
          this.router.navigate([`/community`, name]);
        },
        error: (err) => {
          this.toastService.show(err.message, ToastType.Danger);
        },
      });
  }
}
