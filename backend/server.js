require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
