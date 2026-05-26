import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../courses/course.schema';
import { Branch, BranchDocument } from '../branches/branch.schema';
import { Registration, RegistrationDocument, PaymentStatus, PaymentMethod } from '../registrations/registration.schema';
import { Trial, TrialDocument, TrialStatus } from '../trials/trial.schema';

// Tạo ngày trong quá khứ (cách đây n ngày)
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
// Tạo mã đơn hàng ngẫu nhiên
const orderId = () => 'BAMBI-' + Math.random().toString(36).substring(2, 10).toUpperCase();
const momoId  = () => 'MOMO'  + Date.now().toString().slice(-10) + Math.floor(Math.random()*1000);
const vnpId   = () => 'VNP'   + Date.now().toString().slice(-12) + Math.floor(Math.random()*100);

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Course.name)       private courseModel:       Model<CourseDocument>,
    @InjectModel(Branch.name)       private branchModel:       Model<BranchDocument>,
    @InjectModel(Registration.name) private registrationModel: Model<RegistrationDocument>,
    @InjectModel(Trial.name)        private trialModel:        Model<TrialDocument>,
  ) {}

  async onApplicationBootstrap() {
    const courseCount = await this.courseModel.countDocuments();
    if (courseCount === 0) await this.seedCourses();

    const branchCount = await this.branchModel.countDocuments();
    if (branchCount === 0) await this.seedBranches();

    const regCount = await this.registrationModel.countDocuments();
    if (regCount === 0) {
      const courses = await this.courseModel.find().select('_id').lean();
      if (courses.length > 0) await this.seedRegistrations(courses.map(c => c._id.toString()));
    }

    const trialCount = await this.trialModel.countDocuments();
    if (trialCount === 0) await this.seedTrials();
  }

  // ─── Registrations ───────────────────────────────────────────────────────────
  private async seedRegistrations(courseIds: string[]) {
    const [c0, c1, c2] = courseIds; // Mầm Chồi, Búp Bê, Thiếu Niên
    const records = [
      // ── Tháng 5 (SUCCESS) ──
      { studentName: 'Nguyễn Bảo Ngọc',    parentPhone: '0901234501', courseId: c1, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(2) },
      { studentName: 'Trần Gia Khang',      parentPhone: '0912345602', courseId: c2, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(4) },
      { studentName: 'Lê Minh Châu',        parentPhone: '0903456703', courseId: c0, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(5) },
      { studentName: 'Phạm Thiên Ân',       parentPhone: '0934567804', courseId: c1, paymentStatus: PaymentStatus.PENDING, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), createdAt: daysAgo(1) },
      { studentName: 'Võ Ngọc Hân',         parentPhone: '0945678905', courseId: c2, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(6) },
      { studentName: 'Hoàng Tuấn Kiệt',     parentPhone: '0956789006', courseId: c0, paymentStatus: PaymentStatus.FAILED,  paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), createdAt: daysAgo(3) },
      { studentName: 'Đinh Khánh Linh',     parentPhone: '0967890107', courseId: c1, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(7) },
      { studentName: 'Bùi Gia Hân',         parentPhone: '0978901208', courseId: c2, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(8) },
      // ── Tháng 4 ──
      { studentName: 'Đặng Nhật Minh',      parentPhone: '0989012309', courseId: c0, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(22) },
      { studentName: 'Ngô Thị Phương',      parentPhone: '0900123410', courseId: c1, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(25) },
      { studentName: 'Lý Quốc Huy',         parentPhone: '0911234511', courseId: c2, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(28) },
      { studentName: 'Trương Bảo Thy',      parentPhone: '0922345612', courseId: c0, paymentStatus: PaymentStatus.PENDING, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), createdAt: daysAgo(20) },
      { studentName: 'Mai Xuân Trường',     parentPhone: '0933456713', courseId: c1, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(30) },
      { studentName: 'Phan Ngọc Bích',      parentPhone: '0944567814', courseId: c2, paymentStatus: PaymentStatus.FAILED,  paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), createdAt: daysAgo(24) },
      // ── Tháng 3 ──
      { studentName: 'Vũ Tiến Đạt',         parentPhone: '0955678915', courseId: c0, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(52) },
      { studentName: 'Lê Thanh Thảo',       parentPhone: '0966789016', courseId: c1, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(55) },
      { studentName: 'Nguyễn Hải Đăng',     parentPhone: '0977890117', courseId: c2, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(58) },
      { studentName: 'Trần Khánh Vân',      parentPhone: '0988901218', courseId: c0, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(60) },
      { studentName: 'Phạm Quỳnh Anh',      parentPhone: '0909012319', courseId: c1, paymentStatus: PaymentStatus.FAILED,  paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), createdAt: daysAgo(50) },
      // ── Tháng 2 ──
      { studentName: 'Hoàng Minh Khoa',     parentPhone: '0910123420', courseId: c2, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(82) },
      { studentName: 'Đinh Thu Hương',      parentPhone: '0921234521', courseId: c0, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(85) },
      { studentName: 'Bùi Trọng Nghĩa',     parentPhone: '0932345622', courseId: c1, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(88) },
      { studentName: 'Đặng Thị Lan',        parentPhone: '0943456723', courseId: c2, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(90) },
      // ── Tháng 1 ──
      { studentName: 'Ngô Gia Bảo',         parentPhone: '0954567824', courseId: c0, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(112) },
      { studentName: 'Lý Ngọc Trinh',       parentPhone: '0965678925', courseId: c1, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(115) },
      { studentName: 'Trương Hữu Phúc',     parentPhone: '0976789026', courseId: c2, paymentStatus: PaymentStatus.PENDING, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), createdAt: daysAgo(110) },
      { studentName: 'Mai Thị Hồng Nhung',  parentPhone: '0987890127', courseId: c0, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(118) },
      // ── Tháng 12 (năm trước) ──
      { studentName: 'Phan Thành Long',      parentPhone: '0908901228', courseId: c1, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.VNPAY, orderId: orderId(), vnpayTransId: vnpId(),  createdAt: daysAgo(145) },
      { studentName: 'Vũ Diệu Linh',        parentPhone: '0919012329', courseId: c2, paymentStatus: PaymentStatus.SUCCESS, paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), momoTransId: momoId(), createdAt: daysAgo(148) },
      { studentName: 'Lê Công Danh',        parentPhone: '0920123430', courseId: c0, paymentStatus: PaymentStatus.FAILED,  paymentMethod: PaymentMethod.MOMO,  orderId: orderId(), createdAt: daysAgo(150) },
    ];

    // Dùng insertMany với timestamps thủ công (override createdAt)
    for (const r of records) {
      const { createdAt, ...data } = r as any;
      const doc = await this.registrationModel.create(data);
      await this.registrationModel.updateOne({ _id: doc._id }, { $set: { createdAt } });
    }
    this.logger.log(`✅ Seeded ${records.length} registrations!`);
  }

  // ─── Trials ──────────────────────────────────────────────────────────────────
  private async seedTrials() {
    const trials = [
      // Mới (chưa xử lý)
      { parentName: 'Nguyễn Thị Hà',      phone: '0901111001', studentName: 'Nguyễn Gia Hân',   studentAge: '5', email: 'ha.nguyen@gmail.com',     content: 'Bé muốn học khóa Mầm Chồi',            status: TrialStatus.NEW,       createdAt: daysAgo(0) },
      { parentName: 'Trần Văn Sơn',        phone: '0912222002', studentName: 'Trần Bảo Nam',      studentAge: '7', email: 'son.tran@gmail.com',       content: 'Hỏi thăm khóa English Explorer',        status: TrialStatus.NEW,       createdAt: daysAgo(1) },
      { parentName: 'Lê Thị Kim Anh',      phone: '0923333003', studentName: 'Lê Minh Quân',      studentAge: '9', email: 'kimanh.le@yahoo.com',      content: 'Bé muốn thi Cambridge Starters',        status: TrialStatus.NEW,       createdAt: daysAgo(1) },
      { parentName: 'Phạm Hữu Tài',        phone: '0934444004', studentName: 'Phạm Thanh Thư',    studentAge: '6', email: 'tai.pham@gmail.com',        content: 'Quan tâm lịch học cuối tuần',           status: TrialStatus.NEW,       createdAt: daysAgo(2) },
      { parentName: 'Võ Thị Nguyệt',       phone: '0945555005', studentName: 'Võ Tuấn Khải',      studentAge: '4', email: 'nguyet.vo@hotmail.com',     content: 'Tìm lớp học cho bé 4 tuổi',             status: TrialStatus.NEW,       createdAt: daysAgo(2) },
      // Đã liên hệ
      { parentName: 'Hoàng Văn Khánh',     phone: '0956666006', studentName: 'Hoàng Gia Linh',    studentAge: '8', email: 'khanh.hoang@gmail.com',    content: 'Đăng ký học thử lớp Thiếu Niên',       status: TrialStatus.CONTACTED, note: 'Đã gọi điện, PH đồng ý đưa bé đến thứ 7',   createdAt: daysAgo(5) },
      { parentName: 'Đinh Thị Loan',       phone: '0967777007', studentName: 'Đinh Anh Tú',       studentAge: '10', email: 'loan.dinh@gmail.com',     content: 'Hỏi học phí và lịch khai giảng',        status: TrialStatus.CONTACTED, note: 'Gửi brochure qua Zalo, chờ phản hồi',        createdAt: daysAgo(6) },
      { parentName: 'Bùi Quang Hải',       phone: '0978888008', studentName: 'Bùi Khánh Vy',      studentAge: '5', email: 'hai.bui@gmail.com',         content: 'Hỏi về khóa Mầm Chồi',                 status: TrialStatus.CONTACTED, note: 'PH muốn xem trực tiếp cơ sở Q.1',           createdAt: daysAgo(8) },
      { parentName: 'Đặng Thị Hương',      phone: '0989999009', studentName: 'Đặng Minh Khoa',    studentAge: '7', email: 'huong.dang@gmail.com',     content: 'Tìm trung tâm gần nhà ở Q.Bình Thạnh', status: TrialStatus.CONTACTED, note: 'Đã hẹn lịch học thử 28/5',                   createdAt: daysAgo(7) },
      { parentName: 'Ngô Văn Tuấn',        phone: '0900000010', studentName: 'Ngô Thị Mai',       studentAge: '9', email: 'tuan.ngo@yahoo.com',        content: 'Chuẩn bị thi chứng chỉ Cambridge',      status: TrialStatus.CONTACTED, note: 'PH đang so sánh với trung tâm khác',         createdAt: daysAgo(10) },
      // Đã xong
      { parentName: 'Lý Thị Bình',         phone: '0911111011', studentName: 'Lý Gia Bảo',        studentAge: '6', email: 'binh.ly@gmail.com',         content: 'Học thử lớp Búp Bê',                    status: TrialStatus.DONE,      note: 'Đã đăng ký chính thức khóa Búp Bê',         createdAt: daysAgo(15) },
      { parentName: 'Trương Văn Đức',      phone: '0922222012', studentName: 'Trương Bảo Nghi',   studentAge: '8', email: 'duc.truong@gmail.com',      content: 'Hỏi khóa English Explorer',             status: TrialStatus.DONE,      note: 'Học thử xong, bé thích. Đang làm thủ tục',  createdAt: daysAgo(18) },
      { parentName: 'Mai Thị Lan',         phone: '0933333013', studentName: 'Mai Tuấn Anh',      studentAge: '11', email: 'lan.mai@gmail.com',        content: 'Bé học lớp 5, muốn luyện speaking',     status: TrialStatus.DONE,      note: 'Đã thanh toán học phí đợt 1',               createdAt: daysAgo(20) },
      { parentName: 'Phan Văn Hùng',       phone: '0944444014', studentName: 'Phan Thị Ngọc',     studentAge: '4', email: 'hung.phan@hotmail.com',     content: 'Tìm lớp cho bé chuẩn bị vào lớp 1',    status: TrialStatus.DONE,      note: 'Gia đình hài lòng, sẽ giới thiệu thêm bạn', createdAt: daysAgo(22) },
      { parentName: 'Vũ Thị Thúy',         phone: '0955555015', studentName: 'Vũ Nhật Duy',       studentAge: '7', email: 'thuy.vu@gmail.com',          content: 'Đăng ký học thử cuối tuần',             status: TrialStatus.DONE,      note: 'Hoàn thành. Đã chuyển sang danh sách ĐK',   createdAt: daysAgo(25) },
      { parentName: 'Lê Văn Phong',        phone: '0966666016', studentName: 'Lê Khánh Chi',      studentAge: '5', email: 'phong.le@gmail.com',        content: 'Muốn bé học tiếng Anh sớm',             status: TrialStatus.DONE,      note: 'Đã đăng ký. PH hài lòng với GV lớp Mầm',   createdAt: daysAgo(30) },
    ];

    for (const t of trials) {
      const { createdAt, ...data } = t as any;
      const doc = await this.trialModel.create(data);
      await this.trialModel.updateOne({ _id: doc._id }, { $set: { createdAt } });
    }
    this.logger.log(`✅ Seeded ${trials.length} trials!`);
  }

  // ─── Courses ──────────────────────────────────────────────────────────────────
  private async seedCourses() {
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
    this.logger.log('✅ Seeded 3 courses!');
  }

  // ─── Branches ────────────────────────────────────────────────────────────────
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
          { author: 'Nguyễn Thị Mai', rating: 5, comment: 'Cơ sở rất sạch sẽ, giáo viên nhiệt tình. Con tôi tiến bộ rõ rệt sau 3 tháng!', date: '2025-03-15', avatar: 'https://i.pravatar.cc/80?img=1' },
          { author: 'Trần Văn Hùng',  rating: 4, comment: 'Không gian học tập tốt, phương pháp dạy hiện đại. Bé rất thích đến học.', date: '2025-04-02', avatar: 'https://i.pravatar.cc/80?img=3' },
          { author: 'Lê Thị Hoa',     rating: 5, comment: 'Đội ngũ giáo viên chuyên nghiệp, chương trình học bài bản. Rất hài lòng!', date: '2025-04-20', avatar: 'https://i.pravatar.cc/80?img=5' },
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
          { author: 'Phạm Minh Tuấn', rating: 4, comment: 'Cơ sở gần nhà, tiện lợi. Giáo viên vui vẻ, con tôi rất thích.', date: '2025-02-10', avatar: 'https://i.pravatar.cc/80?img=7' },
          { author: 'Vũ Thị Lan',     rating: 3, comment: 'Cơ sở ổn, tuy nhiên cần thêm tài liệu phong phú hơn.', date: '2025-03-28', avatar: 'https://i.pravatar.cc/80?img=9' },
          { author: 'Đỗ Quang Minh',  rating: 5, comment: 'Tuyệt vời! Bé nhà mình học 2 tháng đã giao tiếp được cơ bản. Recommend!', date: '2025-05-01', avatar: 'https://i.pravatar.cc/80?img=11' },
          { author: 'Hoàng Thị Thu',  rating: 4, comment: 'Phòng học thoáng mát, âm thanh tốt. Đội ngũ giáo viên nhiệt tâm.', date: '2025-05-10', avatar: 'https://i.pravatar.cc/80?img=13' },
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
          { author: 'Nguyễn Văn Bình', rating: 5, comment: 'Cơ sở mới, thiết bị hiện đại. Con học rất vui và tiến bộ nhanh.', date: '2025-04-05', avatar: 'https://i.pravatar.cc/80?img=15' },
          { author: 'Trịnh Thị Nga',   rating: 4, comment: 'Giáo trình Cambridge chuẩn, bé nhà mình đang học rất tốt!', date: '2025-05-15', avatar: 'https://i.pravatar.cc/80?img=17' },
        ],
      },
    ];
    await this.branchModel.insertMany(branches);
    this.logger.log('✅ Seeded 3 branches!');
  }
}
