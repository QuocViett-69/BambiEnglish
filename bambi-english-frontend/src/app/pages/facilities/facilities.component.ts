import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facilities.component.html',
})
export class FacilitiesComponent {
  facilities = [
    { icon: '🖥️', title: 'Phòng học thông minh', desc: 'Màn hình tương tác 75 inch, âm thanh vòm 5.1' },
    { icon: '📚', title: 'Thư viện sách', desc: 'Hơn 500 đầu sách thiếu nhi tiếng Anh các cấp độ' },
    { icon: '🎮', title: 'Góc vui học', desc: 'Board games, flashcards, puzzle tiếng Anh' },
  ];
}
