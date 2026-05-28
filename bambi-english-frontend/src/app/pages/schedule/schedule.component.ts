import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent {
  schedule = [
    { time: '18:00 - 19:30', day: 'Thứ 2 & Thứ 4', room: 'Phòng học 101' },
    { time: '17:30 - 19:00', day: 'Thứ 3 & Thứ 5', room: 'Phòng học 102' }
  ];
}
