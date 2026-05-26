import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { TrialService } from '../../services/trial.service';
import { Course } from '../../models/course.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  course = signal<Course | null>(null);
  loading = signal(true);
  
  trialForm: FormGroup;
  submitSuccess = signal(false);

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private trialService: TrialService,
    private fb: FormBuilder
  ) {
    this.trialForm = this.fb.group({
      parentName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      studentName: [''],
      studentAge: ['']
    });
  }

  submitTrial() {
    if (this.trialForm.valid) {
      this.trialService.createTrial(this.trialForm.value).subscribe({
        next: () => {
          this.submitSuccess.set(true);
          this.trialForm.reset();
          setTimeout(() => this.submitSuccess.set(false), 5000);
        },
        error: (err) => console.error('Error creating trial', err)
      });
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.loading.set(true);
      this.courseService.getById(id).subscribe({
        next: (data) => { this.course.set(data); this.loading.set(false); },
        error: () => { this.loading.set(false); },
      });
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
