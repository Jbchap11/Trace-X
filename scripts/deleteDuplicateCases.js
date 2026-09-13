const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Case = require('../src/models/Case');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const dup = await Case.find({ title: 'Test Case for IOC Linking' }).sort({ createdAt: 1 });
    if (dup.length > 1) {
      const idsToDelete = dup.slice(1).map(d => d._id);
      const result = await Case.deleteMany({ _id: { $in: idsToDelete } });
      console.log('Deleted duplicate test cases:', result.deletedCount);
    } else {
      console.log('No duplicate test cases found.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
})();
