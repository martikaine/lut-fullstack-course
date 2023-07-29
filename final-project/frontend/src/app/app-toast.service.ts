import { Injectable } from '@angular/core';

export interface ToastInfo {
  text: string;
  className?: string;
  delay?: number;
}

export enum ToastType {
  Success = 'bg-success text-light',
  Danger = 'bg-danger text-light',
}

/**
 * Generates toast notifications that can be shown across the application.
 * @see https://ng-bootstrap.github.io/#/components/toast/examples
 */
@Injectable({
  providedIn: 'root',
})
export class AppToastService {
  toasts: ToastInfo[] = [];

  show(message: string, type: ToastType, delay: number = 5000) {
    this.toasts.push({ text: message, className: type, delay });
    console.log(this.toasts);
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
