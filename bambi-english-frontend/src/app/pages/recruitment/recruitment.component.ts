import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruitment.component.html',
})
export class RecruitmentComponent {
  jobs = [
    {
      title: 'Trợ giảng tiếng Anh (Part-time)',
      type: 'Bán thời gian',
      location: 'TP.HCM (Các Chi nhánh)',
      description: 'Hỗ trợ giáo viên nước ngoài trong lớp học, quản lý lớp và hướng dẫn học viên ôn tập.',
      requirements: ['Ưu tiên sinh viên năm nhất, năm hai các trường ĐH/CĐ', 'Giao tiếp tiếng Anh khá', 'Yêu thích trẻ em, năng động, nhiệt tình'],
      salary: 'Thỏa thuận theo năng lực'
    },
    {
      title: 'Nhân viên Tư vấn (Telemarketing)',
      type: 'Toàn thời gian / Bán thời gian',
      location: 'Hội Sở - Quận Gò Vấp',
      description: 'Tư vấn các khóa học tiếng Anh chuẩn Cambridge cho phụ huynh, chăm sóc khách hàng.',
      requirements: ['Giọng nói chuẩn, giao tiếp tốt', 'Không yêu cầu kinh nghiệm (sẽ được đào tạo)', 'Kỹ năng thuyết phục và xử lý tình huống tốt'],
      salary: 'Lương cứng + Hoa hồng hấp dẫn'
    }
  ];
}
