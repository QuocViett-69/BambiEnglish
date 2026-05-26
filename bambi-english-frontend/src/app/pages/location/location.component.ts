import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location.component.html',
})
export class LocationComponent {
  branches = [
    { district: 'Q.1', name: 'Cơ sở Trần Khánh Dư', address: '34/7 Trần Khánh Dư, P. Tân Định, HCM', phone: '028 3823 1111' },
    { district: 'Q.1', name: 'Cơ sở Hồ Hảo Hớn', address: '23A Hồ Hảo Hớn, P. Cầu Ông Lãnh, HCM', phone: '028 3823 2222' },
    { district: 'Q.5', name: 'Cơ sở Phan Văn Trị', address: '380A Phan Văn Trị, P. Chợ Quán, HCM', phone: '028 3923 3333' },
    { district: 'Q.7', name: 'Cơ sở Tân Thuận', address: '13B, Đường 43, P. Tân Thuận, HCM', phone: '028 5416 4444' },
    { district: 'Q.8', name: 'Cơ sở Tùng Lý Vương', address: '227 Tùng Lý Vương, P. Phú Định, HCM', phone: '028 3855 5555' },
    { district: 'Q.10', name: 'Cơ sở Tam Đảo', address: '16CT Tam Đảo, P. Hòa Hưng, HCM', phone: '028 3862 6666' },
    { district: 'Q.11', name: 'Cơ sở Tân Khai', address: '42 Tân Khai, P. Minh Phụng, HCM', phone: '028 3962 7777' },
    { district: 'Q.Phú Nhuận', name: 'Cơ sở Lê Văn Sỹ', address: '115/13/9 Lê Văn Sỹ, P. Phú Nhuận, HCM', phone: '028 3991 8888' },
    { district: 'Q.Tân Phú', name: 'Cơ sở Phan Anh', address: '158/D35 Phan Anh, P. Phú Thạnh, HCM', phone: '028 3861 9999' },
    { district: 'Q.Tân Phú', name: 'Cơ sở Hàn Mặc Tử', address: '14E Hàn Mặc Tử, P. Phú Thọ Hòa, HCM', phone: '028 3861 0000' },
    { district: 'Q.Bình Tân', name: 'Cơ sở KDC Thăng Long', address: '49 Đường số 6, KDC Thăng Long, P. An Lạc, HCM', phone: '028 3752 1111' },
    { district: 'Q.Gò Vấp', name: 'Cơ sở Quang Trung', address: '645/11A Quang Trung, P. Thông Tây Hội, HCM', phone: '028 3894 2222' },
    { district: 'Q.Gò Vấp', name: 'Cơ sở Nguyễn Văn Lượng', address: 'Nguyễn Văn Lượng, P. An Hội Đông, HCM', phone: '028 3894 3333' },
    { district: 'Q.Thủ Đức', name: 'Cơ sở Hiệp Bình', address: '11 Đường Số 4, P. Hiệp Bình, HCM', phone: '028 3726 4444' },
    { district: 'Q.Tân Bình', name: 'Cơ sở Bàu Cát', address: '36 Bàu Cát 6, P. Tân Bình, HCM', phone: '028 3849 5555' },
    { district: 'Q.Bình Thạnh', name: 'Cơ sở Ung Văn Khiêm', address: '340/38 Ung Văn Khiêm, P. Thạnh Mỹ Tây, HCM', phone: '028 3512 6666' }
  ];
}
