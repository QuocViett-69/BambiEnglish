import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrialService } from '../../services/trial.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  contactForm: FormGroup;
  submitSuccess = false;

  constructor(private fb: FormBuilder, private trialService: TrialService) {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      content: ['', Validators.required]
    });
  }

  submitContact() {
    if (this.contactForm.valid) {
      const data = this.contactForm.value;
      const trialData = {
        parentName: data.fullName,
        phone: data.phone,
        email: data.email,
        content: data.content
      };
      
      this.trialService.createTrial(trialData).subscribe({
        next: () => {
          this.submitSuccess = true;
          this.contactForm.reset();
          setTimeout(() => this.submitSuccess = false, 5000);
        },
        error: (err) => console.error('Error submitting contact', err)
      });
    }
  }
}
