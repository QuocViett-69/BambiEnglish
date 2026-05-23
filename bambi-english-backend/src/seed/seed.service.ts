import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../courses/course.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.courseModel.countDocuments();
    if (count === 0) {
      await this.seedCourses();
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
}
