const mongoose = require('mongoose');
const dns = require('dns');

// Force Node to use Google Public DNS for lookup
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  console.log('DNS resolver set to Google DNS');
} catch (e) {
  console.error('Failed to set DNS servers:', e);
}

const URI = 'mongodb+srv://obhikonde_db_user:zrBjVMSzEqwKMSnf@cluster0.k7mpvmo.mongodb.net/ecommerce?retryWrites=true&w=majority';

console.log('Attempting connection...');
mongoose.connect(URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
