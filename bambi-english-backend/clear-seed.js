// Script xóa registrations + trials để seed service tự seed lại khi restart
const mongoose = require('mongoose');

async function clearAndReseed() {
  await mongoose.connect('mongodb://localhost:27017/bambi-english');
  console.log('✅ Connected to MongoDB');

  const regResult = await mongoose.connection.db.collection('registrations').deleteMany({});
  console.log(`🗑️  Deleted ${regResult.deletedCount} registrations`);

  const trialResult = await mongoose.connection.db.collection('trials').deleteMany({});
  console.log(`🗑️  Deleted ${trialResult.deletedCount} trials`);

  await mongoose.disconnect();
  console.log('✅ Done! Restart backend to trigger seed.');
}

clearAndReseed().catch(console.error);
