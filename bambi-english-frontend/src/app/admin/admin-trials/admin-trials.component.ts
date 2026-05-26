import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrialService } from '../../services/trial.service';

@Component({
  selector: 'app-admin-trials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-trials.component.html',
})
export class AdminTrialsComponent implements OnInit {
  trials = signal<any[]>([]);
  loading = signal(true);
  
  isModalOpen = false;
  editingTrial: any = null;

  constructor(private trialService: TrialService) {}

  ngOnInit() {
    this.loadTrials();
  }

  loadTrials() {
    this.loading.set(true);
    this.trialService.getAll().subscribe({
      next: (data) => { this.trials.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openModal(trial: any) {
    this.editingTrial = { ...trial };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingTrial = null;
  }

  saveTrial() {
    this.trialService.update(this.editingTrial._id, {
      status: this.editingTrial.status,
      note: this.editingTrial.note
    }).subscribe(() => {
      this.closeModal();
      this.loadTrials();
    });
  }
}
