import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts: Toast[] = [];
  private nextId = 0;

  success(message: string) {
    this.addToast(message, 'success');
  }

  error(message: string) {
    this.addToast(message, 'error');
  }

  getToasts() {
    return this.toasts;
  }

  private addToast(message: string, type: 'success' | 'error') {
    const toast: Toast = { id: ++this.nextId, message, type };
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 30000);
  }

  private removeToast(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }
}
