const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://rizwanikhan63:root@cluster0.n0mstat.mongodb.net/tournamnet?retryWrites=true&w=majority&appName=Cluster0', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    logger.info('Tournament DB connected');
  } catch (err) {
    logger.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
