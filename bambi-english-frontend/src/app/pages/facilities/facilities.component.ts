import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facilities.component.html',
})
export class FacilitiesComponent {
  categories = ['Tất cả', 'Khu vực Sảnh', 'Phòng học'];
  activeCategory = 'Tất cả';

  // Lọc thủ công dựa trên tên file
  allImages = [
    { url: '/image/HQ0-sanh.jpeg', title: 'Sảnh Đón Tiếp Hội Sở', category: 'Khu vực Sảnh' },
    { url: '/image/HQ0-PH1.jpeg', title: 'Phòng học Tiêu Chuẩn 01', category: 'Phòng học' },
    { url: '/image/HQ0-PH2.jpeg', title: 'Phòng học Tiêu Chuẩn 02', category: 'Phòng học' },
    { url: '/image/HQ1-Sanh.jpeg', title: 'Sảnh Chờ Chi Nhánh 1', category: 'Khu vực Sảnh' },
    { url: '/image/HQ1-PH1.jpeg', title: 'Phòng học Tương Tác 1', category: 'Phòng học' },
    { url: '/image/HQ1-PH2.jpeg', title: 'Phòng học Tương Tác 2', category: 'Phòng học' },
    { url: '/image/HQ2_Sanh.jpeg', title: 'Sảnh Ghi Danh Nhánh 2', category: 'Khu vực Sảnh' },
    { url: '/image/HQ2_PH1.jpeg', title: 'Phòng học Ánh Sáng 1', category: 'Phòng học' },
    { url: '/image/HQ2_PH2.jpeg', title: 'Phòng học Ánh Sáng 2', category: 'Phòng học' },
    { url: '/image/HQ3_Sanh.jpeg', title: 'Sảnh Chính Chi Nhánh 3', category: 'Khu vực Sảnh' },
    { url: '/image/HQ3_PH1.jpeg', title: 'Phòng học Rộng 1', category: 'Phòng học' },
    { url: '/image/HQ3-PH3.jpeg', title: 'Phòng học Rộng 2', category: 'Phòng học' },
    { url: '/image/HQ4-Sanh.jpeg', title: 'Khu vực Tư Vấn 4', category: 'Khu vực Sảnh' },
    { url: '/image/HQ4-PH1.jpeg', title: 'Phòng học Năng Động 1', category: 'Phòng học' },
    { url: '/image/HQ4-PH2.jpeg', title: 'Phòng học Năng Động 2', category: 'Phòng học' },
    { url: '/image/HQ5_Sanh.jpeg', title: 'Sảnh Chờ Khách', category: 'Khu vực Sảnh' },
    { url: '/image/HQ5_Ph1.jpeg', title: 'Phòng học Tiêu Chuẩn', category: 'Phòng học' },
    { url: '/image/HQ5_PH2.jpeg', title: 'Phòng học Đa Phương Tiện', category: 'Phòng học' },
    { url: '/image/HQ6-Sanh.jpeg', title: 'Khu Vực Sinh Hoạt Chung', category: 'Khu vực Sảnh' },
    { url: '/image/HQ6-PH1.jpeg', title: 'Phòng học Cỡ Lớn', category: 'Phòng học' },
    { url: '/image/HQ6-PH2.jpeg', title: 'Phòng học Ngoại Khóa', category: 'Phòng học' },
    { url: '/image/HQ7_Sanh.jpeg', title: 'Sảnh Tiếp Đón VIP', category: 'Khu vực Sảnh' },
    { url: '/image/HQ7_PH1.jpeg', title: 'Phòng học Chất Lượng Cao', category: 'Phòng học' },
    { url: '/image/HQ8_Sanh.jpeg', title: 'Lễ Tân Chi Nhánh', category: 'Khu vực Sảnh' },
    { url: '/image/HQ8_PH1.jpeg', title: 'Phòng học Mẫu giáo', category: 'Phòng học' },
    { url: '/image/HQ9-Sanh.jpeg', title: 'Sảnh Ghi Danh 9', category: 'Khu vực Sảnh' },
    { url: '/image/HQ9-PH1.jpeg', title: 'Phòng học Nhóm', category: 'Phòng học' },
  ];

  get filteredImages() {
    if (this.activeCategory === 'Tất cả') return this.allImages;
    return this.allImages.filter(img => img.category === this.activeCategory);
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
  }
}
