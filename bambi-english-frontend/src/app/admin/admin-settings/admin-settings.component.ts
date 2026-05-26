import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
})
export class AdminSettingsComponent implements OnInit {
  settings: any = {
    centerName: '',
    hotline: '',
    email: '',
    logoUrl: '',
    facebookLink: '',
    youtubeLink: ''
  };
  loading = signal(true);
  saving = signal(false);
  saveSuccess = signal(false);

  constructor(private settingService: SettingService) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading.set(true);
    this.settingService.getSettings().subscribe({
      next: (data) => {
        if (data) this.settings = data;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  saveSettings() {
    this.saving.set(true);
    this.settingService.updateSettings(this.settings).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: () => this.saving.set(false)
    });
  }
}
