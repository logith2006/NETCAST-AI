const mongoose = require('mongoose');

const networkLogSchema = new mongoose.Schema({
  networkName: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  latency: {
    type: Number,
    required: true,
  },
  downloadSpeed: {
    type: Number,
    required: true,
  },
  uploadSpeed: {
    type: Number,
    required: true,
  },
  connectedDevices: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('NetworkLog', networkLogSchema);
