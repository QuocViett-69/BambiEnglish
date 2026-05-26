import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../courses/course.schema';
import { Branch, BranchDocument } from '../branches/branch.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async onApplicationBootstrap() {
    const courseCount = await this.courseModel.countDocuments();
    if (courseCount === 0) {
      await this.seedCourses();
    }

    const branchCount = await this.branchModel.countDocuments();
    if (branchCount === 0) {
      await this.seedBranches();
    }
  }

  private async seedCourses() {
    const courses = [
      {
        title: 'English Starters – Mầm Chồi (3–5 tuổi)',
        shortDescription:
          'Khai mở ngôn ngữ qua bài hát, trò chơi và flashcard sinh động. Bé học từ vựng, phát âm chuẩn từ sớm.',
        price: 1800000,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
      },
      {
        title: 'English Explorer – Búp Bê (6–8 tuổi)',
        shortDescription:
          'Kết hợp phonics và giao tiếp cơ bản. Học sinh tự tin đặt câu, hỏi – đáp trong tình huống đời thường.',
        price: 2400000,
        imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600',
      },
      {
        title: 'English Champion – Thiếu Niên (9–12 tuổi)',
        shortDescription:
          'Luyện 4 kỹ năng Nghe–Nói–Đọc–Viết chuyên sâu. Định hướng thi chứng chỉ Cambridge Starters / Movers.',
        price: 3200000,
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
      },
    ];

    await this.courseModel.insertMany(courses);
    this.logger.log('✅ Seeded 3 mock courses successfully!');
  }

  private async seedBranches() {
    const branches = [
      {
        name: 'Bambi English – Quận 1',
        address: '12 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        phone: '028 3822 1234',
        openingHours: '08:00 – 21:00',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
        mapLink: 'https://maps.google.com',
        reviews: [
          {
            author: 'Nguyễn Thị Mai',
            rating: 5,
            comment: 'Cơ sở rất sạch sẽ, giáo viên nhiệt tình. Con tôi tiến bộ rõ rệt sau 3 tháng!',
            date: '2025-03-15',
            avatar: 'https://i.pravatar.cc/80?img=1',
          },
          {
            author: 'Trần Văn Hùng',
            rating: 4,
            comment: 'Không gian học tập tốt, phương pháp dạy hiện đại. Bé rất thích đến học.',
            date: '2025-04-02',
            avatar: 'https://i.pravatar.cc/80?img=3',
          },
          {
            author: 'Lê Thị Hoa',
            rating: 5,
            comment: 'Đội ngũ giáo viên chuyên nghiệp, chương trình học bài bản. Rất hài lòng!',
            date: '2025-04-20',
            avatar: 'https://i.pravatar.cc/80?img=5',
          },
        ],
      },
      {
        name: 'Bambi English – Bình Thạnh',
        address: '45 Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh, TP.HCM',
        phone: '028 3512 5678',
        openingHours: '08:00 – 21:00',
        imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600',
        mapLink: 'https://maps.google.com',
        reviews: [
          {
            author: 'Phạm Minh Tuấn',
            rating: 4,
            comment: 'Cơ sở gần nhà, tiện lợi. Giáo viên vui vẻ, con tôi rất thích.',
            date: '2025-02-10',
            avatar: 'https://i.pravatar.cc/80?img=7',
          },
          {
            author: 'Vũ Thị Lan',
            rating: 3,
            comment: 'Cơ sở ổn, tuy nhiên cần thêm tài liệu học tập phong phú hơn cho bé.',
            date: '2025-03-28',
            avatar: 'https://i.pravatar.cc/80?img=9',
          },
          {
            author: 'Đỗ Quang Minh',
            rating: 5,
            comment: 'Tuyệt vời! Bé nhà mình học 2 tháng đã giao tiếp được cơ bản. Recommend!',
            date: '2025-05-01',
            avatar: 'https://i.pravatar.cc/80?img=11',
          },
          {
            author: 'Hoàng Thị Thu',
            rating: 4,
            comment: 'Phòng học thoáng mát, âm thanh tốt. Đội ngũ giáo viên nhiệt tâm.',
            date: '2025-05-10',
            avatar: 'https://i.pravatar.cc/80?img=13',
          },
        ],
      },
      {
        name: 'Bambi English – Thủ Đức',
        address: '78 Võ Văn Ngân, Phường Bình Thọ, Thành phố Thủ Đức, TP.HCM',
        phone: '028 3896 9012',
        openingHours: '08:00 – 21:00',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
        mapLink: 'https://maps.google.com',
        reviews: [
          {
            author: 'Nguyễn Văn Bình',
            rating: 5,
            comment: 'Cơ sở mới, thiết bị hiện đại. Con học rất vui và tiến bộ nhanh.',
            date: '2025-04-05',
            avatar: 'https://i.pravatar.cc/80?img=15',
          },
          {
            author: 'Trịnh Thị Nga',
            rating: 4,
            comment: 'Giáo trình Cambridge chuẩn, bé nhà mình đang học rất tốt!',
            date: '2025-05-15',
            avatar: 'https://i.pravatar.cc/80?img=17',
          },
        ],
      },
    ];

    await this.branchModel.insertMany(branches);
    this.logger.log('✅ Seeded 3 mock branches with reviews successfully!');
  }
}
