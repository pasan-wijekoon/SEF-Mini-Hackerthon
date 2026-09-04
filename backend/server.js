require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (_) {}

// Patch dns.lookup because Node's native MongoDB driver uses OS getaddrinfo which fails on some ISP DNS
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  dns.resolve4(hostname, (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      if (options && options.all) {
        return callback(null, addresses.map((a) => ({ address: a, family: 4 })));
      }
      return callback(null, addresses[0], 4);
    }
    originalLookup(hostname, options, callback);
  });
};

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start Server
const server = app.listen(PORT, () => {
  console.log(`[Server] Server is running on port ${PORT}`);
  console.log(`[Server] URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Error] ${err.message}`);
  // Optional: server.close(() => process.exit(1));
});