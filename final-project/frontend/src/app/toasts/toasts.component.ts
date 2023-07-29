import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToastService } from '../app-toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.className"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      {{ toast.text }}
    </ngb-toast>
  `,
  styleUrls: ['./toasts.component.scss'],
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsComponent {
  constructor(public toastService: AppToastService) {}
}
