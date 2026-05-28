import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Branch {
  name: string;
  address: string;
  phone: string;
  image: string;
  mapUrl?: SafeResourceUrl;
  licenses: string[];
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location.component.html',
})
export class LocationComponent {
  branches: Branch[] = [];
  activeBranch: Branch | null = null;
  activeTab: 'map' | 'licenses' = 'map';

  constructor(private sanitizer: DomSanitizer) {
    const rawBranches = [
      { 
        name: 'Cơ sở 1 (P. Thông Tây Hội)', 
        address: '641/44 Quang Trung, Phường Thông Tây Hội, Q.Gò Vấp, TP.HCM', 
        phone: '0948 064 000', 
        image: '/image/thongtayhoi.jpg',
        licenses: ['/image/licenses/cs1_1.jpg', '/image/licenses/cs1_2.jpg']
      },
      { 
        name: 'Cơ sở 2 (P. Thạnh Mỹ Tây)', 
        address: '340/38 Ung Văn Khiêm, Phường Thạnh Mỹ Tây, Q.Bình Thạnh, TP.HCM', 
        phone: '0778 800 030', 
        image: '/image/thanhmytay.jpg',
        licenses: ['/image/licenses/cs2_1.jpg', '/image/licenses/cs2_2.jpg']
      },
      { 
        name: 'Cơ sở 3 (P. An Hội Đông)', 
        address: '304 Nguyễn Văn Lượng, Phường An Hội Đông, Q.Gò Vấp, TP.HCM', 
        phone: '0789 990 080', 
        image: '/image/anhoidong.jpg',
        licenses: ['/image/licenses/cs3_1.jpg', '/image/licenses/cs3_2.jpg']
      },
      { 
        name: 'Cơ sở 4 (P. Hiệp Bình)', 
        address: '11 đường số 4, phường Hiệp Bình, TP Thủ Đức, TP.HCM', 
        phone: '0777 000 840', 
        image: '/image/hiepbinh.jpg',
        licenses: ['/image/licenses/cs4_1.jpg', '/image/licenses/cs4_2.jpg']
      },
    ];

    this.branches = rawBranches.map(b => ({
      ...b,
      mapUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://maps.google.com/maps?q=${encodeURIComponent(b.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`)
    }));
  }

  showMap(branch: Branch) {
    this.activeBranch = branch;
    this.activeTab = 'map';
  }
  
  closeMap() {
    this.activeBranch = null;
  }
}
