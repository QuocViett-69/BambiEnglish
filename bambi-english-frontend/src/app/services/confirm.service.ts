import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  isOpen = signal(false);
  options = signal<ConfirmOptions>({ message: '' });

  private resolve!: (result: boolean) => void;

  open(options: ConfirmOptions): Promise<boolean> {
    this.options.set({
      title: options.title ?? 'Xác nhận',
      message: options.message,
      confirmText: options.confirmText ?? 'Xác nhận',
      cancelText: options.cancelText ?? 'Hủy',
      danger: options.danger ?? true,
    });
    this.isOpen.set(true);
    return new Promise(resolve => { this.resolve = resolve; });
  }

  confirm() {
    this.isOpen.set(false);
    this.resolve(true);
  }

  cancel() {
    this.isOpen.set(false);
    this.resolve(false);
  }
}
