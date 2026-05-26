const { MongoClient, ObjectId } = require('mongodb');

async function main() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  const db = client.db('bambi-english');
  const col = db.collection('branches');

  // Get all existing branches
  const branches = await col.find({}).toArray();
  console.log(`Found ${branches.length} branches`);

  const reviewSets = [
    [
      { author: 'Nguyễn Thị Mai', rating: 5, comment: 'Cơ sở rất sạch sẽ, giáo viên nhiệt tình. Con tôi tiến bộ rõ rệt sau 3 tháng!', date: '2025-03-15', avatar: 'https://i.pravatar.cc/80?img=1' },
      { author: 'Trần Văn Hùng', rating: 4, comment: 'Không gian học tập tốt, phương pháp dạy hiện đại. Bé rất thích đến học.', date: '2025-04-02', avatar: 'https://i.pravatar.cc/80?img=3' },
      { author: 'Lê Thị Hoa', rating: 5, comment: 'Đội ngũ giáo viên chuyên nghiệp, chương trình học bài bản. Rất hài lòng!', date: '2025-04-20', avatar: 'https://i.pravatar.cc/80?img=5' },
    ],
    [
      { author: 'Phạm Minh Tuấn', rating: 4, comment: 'Cơ sở gần nhà, tiện lợi. Giáo viên vui vẻ, con tôi rất thích.', date: '2025-02-10', avatar: 'https://i.pravatar.cc/80?img=7' },
      { author: 'Vũ Thị Lan', rating: 3, comment: 'Cơ sở ổn, tuy nhiên cần thêm tài liệu học tập phong phú hơn cho bé.', date: '2025-03-28', avatar: 'https://i.pravatar.cc/80?img=9' },
      { author: 'Đỗ Quang Minh', rating: 5, comment: 'Tuyệt vời! Bé nhà mình học 2 tháng đã giao tiếp được cơ bản. Recommend!', date: '2025-05-01', avatar: 'https://i.pravatar.cc/80?img=11' },
      { author: 'Hoàng Thị Thu', rating: 4, comment: 'Phòng học thoáng mát, âm thanh tốt. Đội ngũ giáo viên nhiệt tâm.', date: '2025-05-10', avatar: 'https://i.pravatar.cc/80?img=13' },
    ],
    [
      { author: 'Nguyễn Văn Bình', rating: 5, comment: 'Cơ sở mới, thiết bị hiện đại. Con học rất vui và tiến bộ nhanh.', date: '2025-04-05', avatar: 'https://i.pravatar.cc/80?img=15' },
      { author: 'Trịnh Thị Nga', rating: 4, comment: 'Giáo trình Cambridge chuẩn, bé nhà mình đang học rất tốt!', date: '2025-05-15', avatar: 'https://i.pravatar.cc/80?img=17' },
    ],
  ];

  const imageUrls = [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
  ];

  for (let i = 0; i < branches.length; i++) {
    const b = branches[i];
    const reviews = reviewSets[i] || reviewSets[0];
    const imageUrl = b.imageUrl || imageUrls[i] || imageUrls[0];
    await col.updateOne(
      { _id: b._id },
      { $set: { reviews, imageUrl } }
    );
    console.log(`✅ Updated branch: ${b.name} with ${reviews.length} reviews`);
  }

  await client.close();
  console.log('Done!');
}

main().catch(console.error);
