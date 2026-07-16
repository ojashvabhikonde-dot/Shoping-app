const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Fallback DNS servers for SRV resolution
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (dnsErr) {
      console.warn('DNS server fallback warning:', dnsErr.message);
    }

    const primaryURI = process.env.MONGODB_URI;
    const localURI = 'mongodb://localhost:27017/ecommerce';

    if (primaryURI) {
      try {
        console.log('Connecting to MongoDB Atlas...');
        // Set short timeout so it fails fast if blocked
        const conn = await mongoose.connect(primaryURI, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected to Atlas: ${conn.connection.host}`);
        return;
      } catch (atlasErr) {
        console.error(`MongoDB Atlas Connection Error: ${atlasErr.message}`);
        console.log('Attempting fallback to local MongoDB...');
      }
    }

    const conn = await mongoose.connect(localURI);
    console.log(`MongoDB Connected to Local Fallback: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Failure: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

