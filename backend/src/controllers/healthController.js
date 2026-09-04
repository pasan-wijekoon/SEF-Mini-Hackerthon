const mongoose = require('mongoose');

// @desc    Get health and system status
// @route   GET /api/health
// @access  Public
const getHealthStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    message: 'Server is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`,
    database: {
      status: states[dbState] || 'unknown',
      readyState: dbState,
    },
  });
};

module.exports = {
  getHealthStatus,
};
