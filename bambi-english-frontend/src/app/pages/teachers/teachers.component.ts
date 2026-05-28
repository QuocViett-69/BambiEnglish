import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Teacher {
  name: string;
  major: string;
  branch: string;
  gender: 'M' | 'F';
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teachers.component.html',
})
export class TeachersComponent {
  teachers: Teacher[] = [
    { name: 'Thầy Trà Huy Vũ', major: 'Ngôn Ngữ Anh', branch: 'NN Thiếu Nhi 2', gender: 'M' },
    { name: 'Cô Huỳnh Thị Thu Hậu', major: 'Ngôn Ngữ Anh', branch: 'NN Thiếu Nhi 1', gender: 'F' },
    { name: 'Thầy Nguyễn Minh Luân', major: 'Tiếng Anh thương mại', branch: 'NN Thiếu Nhi 2', gender: 'M' },
    { name: 'Cô Lê Thị Quỳnh Giao', major: 'Ngôn Ngữ Anh', branch: 'NN Thiếu Nhi 3', gender: 'F' },
    { name: 'Cô Phạm Thị Cẩm Giang', major: 'Ngôn Ngữ Anh', branch: 'NN Thiếu Nhi 3', gender: 'F' },
  ];
}
