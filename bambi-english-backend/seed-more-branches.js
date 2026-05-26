const { MongoClient } = require('mongodb');

const newBranches = [
  {
    name: 'Bambi English – Quận 7',
    address: '13B Đường 43, P. Tân Thuận, HCM',
    phone: '028 5416 4444',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
    mapLink: 'https://maps.google.com/?q=13B+Đường+43,+Tân+Thuận,+Quận+7,+HCM',
    reviews: [
      { author: 'Nguyễn Thị Lan', rating: 5, comment: 'Cơ sở sạch đẹp, giáo viên tận tâm. Bé rất thích!', date: '2025-03-10', avatar: 'https://i.pravatar.cc/80?img=20' },
      { author: 'Trần Minh Khoa', rating: 4, comment: 'Chương trình học tốt, phù hợp với lứa tuổi.', date: '2025-04-15', avatar: 'https://i.pravatar.cc/80?img=21' },
    ],
  },
  {
    name: 'Bambi English – Trần Khánh Dư (Q.1)',
    address: '34/7 Trần Khánh Dư, P. Tân Định, HCM',
    phone: '028 3823 1111',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600',
    mapLink: 'https://maps.google.com/?q=34/7+Trần+Khánh+Dư,+Tân+Định,+Quận+1,+HCM',
    reviews: [
      { author: 'Lê Thị Hạnh', rating: 5, comment: 'Vị trí trung tâm, rất tiện lợi. Giáo viên nhiệt tình!', date: '2025-02-20', avatar: 'https://i.pravatar.cc/80?img=22' },
      { author: 'Phạm Văn Đức', rating: 4, comment: 'Con tôi học ở đây 6 tháng, tiến bộ rõ rệt.', date: '2025-05-05', avatar: 'https://i.pravatar.cc/80?img=23' },
      { author: 'Hoàng Thị Mai', rating: 5, comment: 'Cơ sở đẹp, thiết bị hiện đại, rất hài lòng!', date: '2025-05-12', avatar: 'https://i.pravatar.cc/80?img=24' },
    ],
  },
  {
    name: 'Bambi English – Hồ Hảo Hớn (Q.1)',
    address: '23A Hồ Hảo Hớn, P. Cầu Ông Lãnh, HCM',
    phone: '028 3823 2222',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    mapLink: 'https://maps.google.com/?q=23A+Hồ+Hảo+Hớn,+Cầu+Ông+Lãnh,+Quận+1,+HCM',
    reviews: [
      { author: 'Võ Thị Thu', rating: 4, comment: 'Không gian học tập thoải mái, bé rất thích đến lớp.', date: '2025-03-25', avatar: 'https://i.pravatar.cc/80?img=25' },
      { author: 'Ngô Văn Hải', rating: 5, comment: 'Giáo viên bản ngữ rất chuyên nghiệp, bé giao tiếp tốt hơn nhiều!', date: '2025-04-30', avatar: 'https://i.pravatar.cc/80?img=26' },
    ],
  },
  {
    name: 'Bambi English – Phan Văn Trị (Q.5)',
    address: '380A Phan Văn Trị, P. Chợ Quán, HCM',
    phone: '028 3923 3333',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
    mapLink: 'https://maps.google.com/?q=380A+Phan+Văn+Trị,+Chợ+Quán,+Quận+5,+HCM',
    reviews: [
      { author: 'Đinh Thị Hoa', rating: 4, comment: 'Phương pháp dạy học sáng tạo, bé tiếp thu nhanh.', date: '2025-01-15', avatar: 'https://i.pravatar.cc/80?img=27' },
      { author: 'Lý Văn Tâm', rating: 3, comment: 'Cơ sở ổn nhưng đôi khi lớp học hơi đông.', date: '2025-03-01', avatar: 'https://i.pravatar.cc/80?img=28' },
      { author: 'Trần Thị Bích', rating: 5, comment: 'Giáo trình Cambridge chuẩn quốc tế, rất hài lòng!', date: '2025-05-18', avatar: 'https://i.pravatar.cc/80?img=29' },
    ],
  },
  {
    name: 'Bambi English – Tuy Lý Vương (Q.8)',
    address: '227 Tuy Lý Vương, P. Phú Định, HCM',
    phone: '028 3855 5555',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
    mapLink: 'https://maps.google.com/?q=227+Tuy+Lý+Vương,+Phú+Định,+Quận+8,+HCM',
    reviews: [
      { author: 'Phan Thị Ngọc', rating: 5, comment: 'Cơ sở mới, không gian rộng rãi, thoáng mát.', date: '2025-04-08', avatar: 'https://i.pravatar.cc/80?img=30' },
      { author: 'Dương Văn Long', rating: 4, comment: 'Giáo viên trẻ, năng động, dạy rất hay.', date: '2025-05-20', avatar: 'https://i.pravatar.cc/80?img=31' },
    ],
  },
  {
    name: 'Bambi English – Tam Đảo (Q.10)',
    address: '16CT Tam Đảo, P. Hòa Hưng, HCM',
    phone: '028 3862 6666',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600',
    mapLink: 'https://maps.google.com/?q=16CT+Tam+Đảo,+Hòa+Hưng,+Quận+10,+HCM',
    reviews: [
      { author: 'Bùi Thị Yến', rating: 4, comment: 'Bé học vui, không bị áp lực. Rất phù hợp cho trẻ nhỏ.', date: '2025-02-28', avatar: 'https://i.pravatar.cc/80?img=32' },
      { author: 'Hồ Văn Minh', rating: 5, comment: 'Nhân viên thân thiện, hỗ trợ phụ huynh rất nhiệt tình.', date: '2025-04-22', avatar: 'https://i.pravatar.cc/80?img=33' },
      { author: 'Lưu Thị Hồng', rating: 4, comment: 'Con tiến bộ sau 2 tháng học, recommend cho mọi người!', date: '2025-05-14', avatar: 'https://i.pravatar.cc/80?img=34' },
    ],
  },
  {
    name: 'Bambi English – Tân Khai (Q.11)',
    address: '42 Tân Khai, P. Minh Phụng, HCM',
    phone: '028 3962 7777',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
    mapLink: 'https://maps.google.com/?q=42+Tân+Khai,+Minh+Phụng,+Quận+11,+HCM',
    reviews: [
      { author: 'Trương Thị Kim', rating: 5, comment: 'Tuyệt vời! Bé nhà tôi rất thích thầy cô ở đây.', date: '2025-03-12', avatar: 'https://i.pravatar.cc/80?img=35' },
      { author: 'Vương Minh Tuấn', rating: 4, comment: 'Chương trình học thú vị, bé không bị chán.', date: '2025-04-25', avatar: 'https://i.pravatar.cc/80?img=36' },
    ],
  },
  {
    name: 'Bambi English – Lê Văn Sỹ (Q.Phú Nhuận)',
    address: '115/13/9 Lê Văn Sỹ, P. Phú Nhuận, HCM',
    phone: '028 3991 8888',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600',
    mapLink: 'https://maps.google.com/?q=115/13/9+Lê+Văn+Sỹ,+Phú+Nhuận,+HCM',
    reviews: [
      { author: 'Nguyễn Thị Phương', rating: 5, comment: 'Vị trí đẹp, cơ sở vật chất hiện đại. Bé rất vui khi đi học!', date: '2025-01-20', avatar: 'https://i.pravatar.cc/80?img=37' },
      { author: 'Đặng Văn Hòa', rating: 4, comment: 'Đội ngũ giáo viên giàu kinh nghiệm, nhiệt tình.', date: '2025-03-18', avatar: 'https://i.pravatar.cc/80?img=38' },
      { author: 'Mai Thị Linh', rating: 5, comment: 'Con học ở đây 1 năm, phát âm tiếng Anh chuẩn hẳn!', date: '2025-05-08', avatar: 'https://i.pravatar.cc/80?img=39' },
    ],
  },
  {
    name: 'Bambi English – Phan Anh (Q.Tân Phú)',
    address: '158/D35 Phan Anh, P. Phú Thạnh, HCM',
    phone: '028 3861 9999',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    mapLink: 'https://maps.google.com/?q=158/D35+Phan+Anh,+Phú+Thạnh,+Tân+Phú,+HCM',
    reviews: [
      { author: 'Lê Thị Diệu', rating: 4, comment: 'Cơ sở gần nhà, rất tiện. Thầy cô nhiệt tình, yêu trẻ.', date: '2025-02-14', avatar: 'https://i.pravatar.cc/80?img=40' },
      { author: 'Phùng Văn Bảo', rating: 5, comment: 'Bé học ở đây rất vui, tiến bộ từng tuần thấy rõ!', date: '2025-04-10', avatar: 'https://i.pravatar.cc/80?img=41' },
    ],
  },
  {
    name: 'Bambi English – Hàn Mặc Tử (Q.Tân Phú)',
    address: '14E Hàn Mặc Tử, P. Phú Thọ Hòa, HCM',
    phone: '028 3861 0000',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
    mapLink: 'https://maps.google.com/?q=14E+Hàn+Mặc+Tử,+Phú+Thọ+Hòa,+Tân+Phú,+HCM',
    reviews: [
      { author: 'Cao Thị Thúy', rating: 3, comment: 'Cơ sở ổn, giáo viên thân thiện. Cần cải thiện thêm về CSVC.', date: '2025-03-05', avatar: 'https://i.pravatar.cc/80?img=42' },
      { author: 'Lâm Văn Phú', rating: 4, comment: 'Chương trình phù hợp, con rất thích đi học.', date: '2025-04-18', avatar: 'https://i.pravatar.cc/80?img=43' },
      { author: 'Đỗ Thị Hương', rating: 5, comment: 'Xuất sắc! Bé phát âm tốt hơn rất nhiều sau 3 tháng.', date: '2025-05-22', avatar: 'https://i.pravatar.cc/80?img=44' },
    ],
  },
  {
    name: 'Bambi English – KDC Thăng Long (Q.Bình Tân)',
    address: '49 Đường số 6, KDC Thăng Long, P. An Lạc, HCM',
    phone: '028 3752 1111',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
    mapLink: 'https://maps.google.com/?q=49+Đường+số+6,+KDC+Thăng+Long,+An+Lạc,+Bình+Tân,+HCM',
    reviews: [
      { author: 'Trần Thị Xuân', rating: 5, comment: 'Tuyệt vời! Cơ sở sạch đẹp, giáo viên giỏi và nhiệt tình.', date: '2025-02-05', avatar: 'https://i.pravatar.cc/80?img=45' },
      { author: 'Nguyễn Văn Khải', rating: 4, comment: 'Bé học ở đây rất vui vẻ, không khí lớp học sinh động.', date: '2025-03-30', avatar: 'https://i.pravatar.cc/80?img=46' },
    ],
  },
  {
    name: 'Bambi English – Quang Trung (Q.Gò Vấp)',
    address: '645/11A Quang Trung, P. Thông Tây Hội, HCM',
    phone: '028 3894 2222',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600',
    mapLink: 'https://maps.google.com/?q=645/11A+Quang+Trung,+Thông+Tây+Hội,+Gò+Vấp,+HCM',
    reviews: [
      { author: 'Vũ Thị Nhung', rating: 4, comment: 'Lớp học không đông, thầy cô chú ý từng bé. Rất tốt!', date: '2025-01-28', avatar: 'https://i.pravatar.cc/80?img=47' },
      { author: 'Hoàng Văn Dũng', rating: 5, comment: 'Con tôi học ở đây 8 tháng, tiến bộ vượt trội. Cảm ơn Bambi!', date: '2025-04-03', avatar: 'https://i.pravatar.cc/80?img=48' },
      { author: 'Bùi Thị Cẩm', rating: 4, comment: 'Phương pháp dạy phonic rất hiệu quả, bé đọc được nhiều từ.', date: '2025-05-16', avatar: 'https://i.pravatar.cc/80?img=49' },
    ],
  },
  {
    name: 'Bambi English – Nguyễn Văn Lượng (Q.Gò Vấp)',
    address: 'Nguyễn Văn Lượng, P. An Hội Đông, HCM',
    phone: '028 3894 3333',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
    mapLink: 'https://maps.google.com/?q=Nguyễn+Văn+Lượng,+An+Hội+Đông,+Gò+Vấp,+HCM',
    reviews: [
      { author: 'Đinh Văn Tài', rating: 5, comment: 'Cơ sở rộng rãi, có khu vui chơi cho bé trước và sau lớp.', date: '2025-03-20', avatar: 'https://i.pravatar.cc/80?img=50' },
      { author: 'Lý Thị Cúc', rating: 4, comment: 'Giáo viên yêu trẻ, không gian học thân thiện.', date: '2025-05-02', avatar: 'https://i.pravatar.cc/80?img=51' },
    ],
  },
  {
    name: 'Bambi English – Hiệp Bình (Q.Thủ Đức)',
    address: '11 Đường Số 4, P. Hiệp Bình, HCM',
    phone: '028 3726 4444',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600',
    mapLink: 'https://maps.google.com/?q=11+Đường+Số+4,+Hiệp+Bình,+Thủ+Đức,+HCM',
    reviews: [
      { author: 'Nguyễn Thị Kiều', rating: 5, comment: 'Con rất thích học ở đây! Môi trường tốt, bạn bè vui vẻ.', date: '2025-02-10', avatar: 'https://i.pravatar.cc/80?img=52' },
      { author: 'Trần Văn Phong', rating: 4, comment: 'Đội ngũ giáo viên chuyên nghiệp, tận tâm với học sinh.', date: '2025-04-14', avatar: 'https://i.pravatar.cc/80?img=53' },
      { author: 'Phan Thị Thu Hà', rating: 5, comment: 'Chương trình phong phú, bé không bị nhàm chán khi học.', date: '2025-05-25', avatar: 'https://i.pravatar.cc/80?img=54' },
    ],
  },
  {
    name: 'Bambi English – Bàu Cát (Q.Tân Bình)',
    address: '36 Bàu Cát 6, P. Tân Bình, HCM',
    phone: '028 3849 5555',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
    mapLink: 'https://maps.google.com/?q=36+Bàu+Cát+6,+Tân+Bình,+HCM',
    reviews: [
      { author: 'Võ Minh Châu', rating: 4, comment: 'Cơ sở khang trang, có điều hòa mát. Bé học thoải mái.', date: '2025-03-08', avatar: 'https://i.pravatar.cc/80?img=55' },
      { author: 'Đoàn Thị Lan', rating: 5, comment: 'Giáo viên rất sáng tạo trong cách dạy, bé tiến bộ nhanh!', date: '2025-04-28', avatar: 'https://i.pravatar.cc/80?img=56' },
    ],
  },
  {
    name: 'Bambi English – Ung Văn Khiêm (Q.Bình Thạnh)',
    address: '340/38 Ung Văn Khiêm, P. Thạnh Mỹ Tây, HCM',
    phone: '028 3512 6666',
    openingHours: '08:00 – 21:00',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
    mapLink: 'https://maps.google.com/?q=340/38+Ung+Văn+Khiêm,+Thạnh+Mỹ+Tây,+Bình+Thạnh,+HCM',
    reviews: [
      { author: 'Lê Văn Quân', rating: 4, comment: 'Cơ sở ở vị trí thuận lợi, bé học rất hăng say.', date: '2025-01-30', avatar: 'https://i.pravatar.cc/80?img=57' },
      { author: 'Hà Thị Nga', rating: 5, comment: 'Giáo trình quốc tế, phát âm chuẩn. Rất recommend!', date: '2025-03-22', avatar: 'https://i.pravatar.cc/80?img=58' },
      { author: 'Dương Thị Thảo', rating: 4, comment: 'Thầy cô kiên nhẫn với trẻ, bé rất thích đi học.', date: '2025-05-11', avatar: 'https://i.pravatar.cc/80?img=59' },
    ],
  },
];

async function main() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('bambi-english');
  const col = db.collection('branches');

  const result = await col.insertMany(newBranches);
  console.log(`✅ Inserted ${result.insertedCount} branches successfully!`);

  const total = await col.countDocuments();
  console.log(`📊 Total branches in DB: ${total}`);

  await client.close();
}

main().catch(console.error);
