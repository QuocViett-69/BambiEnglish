"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("../courses/course.schema");
let SeedService = SeedService_1 = class SeedService {
    courseModel;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    async onApplicationBootstrap() {
        const count = await this.courseModel.countDocuments();
        if (count === 0) {
            await this.seedCourses();
        }
    }
    async seedCourses() {
        const courses = [
            {
                title: 'English Starters – Mầm Chồi (3–5 tuổi)',
                shortDescription: 'Khai mở ngôn ngữ qua bài hát, trò chơi và flashcard sinh động. Bé học từ vựng, phát âm chuẩn từ sớm.',
                price: 1800000,
                imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
            },
            {
                title: 'English Explorer – Búp Bê (6–8 tuổi)',
                shortDescription: 'Kết hợp phonics và giao tiếp cơ bản. Học sinh tự tin đặt câu, hỏi – đáp trong tình huống đời thường.',
                price: 2400000,
                imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600',
            },
            {
                title: 'English Champion – Thiếu Niên (9–12 tuổi)',
                shortDescription: 'Luyện 4 kỹ năng Nghe–Nói–Đọc–Viết chuyên sâu. Định hướng thi chứng chỉ Cambridge Starters / Movers.',
                price: 3200000,
                imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
            },
        ];
        await this.courseModel.insertMany(courses);
        this.logger.log('✅ Seeded 3 mock courses successfully!');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map