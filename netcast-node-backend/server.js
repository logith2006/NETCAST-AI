const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const http = require('http');
const https = require('https');
const NetworkLog = require('./models/NetworkLog');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/netcast')
  .then(() => {
    console.log('✅ Connected to MongoDB');
  }).catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// Store networks that users have registered
const registeredNetworks = new Map();

// Global variables for real speed
let realDownloadSpeed = 0;
let realUploadSpeed = 0;
let isSpeedTestRunning = false;

// Helper: Measure Latency
const measureLatency = () => {
  return new Promise((resolve) => {
    exec('ping -n 1 8.8.8.8', (error, stdout) => {
      if (error) return resolve(0);
      const match = stdout.match(/time=(\d+)ms/);
      if (match && match[1]) {
        resolve(parseInt(match[1], 10));
      } else {
        resolve(0);
      }
    });
  });
};

// Helper: Count Devices via ARP
const countConnectedDevices = () => {
  return new Promise((resolve) => {
    exec('arp -a', (error, stdout) => {
      if (error) return resolve(1);
      const lines = stdout.split('\n');
      const uniqueDevices = new Set();
      lines.forEach(line => {
        if (line.includes('dynamic')) {
          const ip = line.trim().split(/\s+/)[0];
          uniqueDevices.add(ip);
        }
      });
      resolve(uniqueDevices.size > 0 ? uniqueDevices.size : 1);
    });
  });
};

// Real Speed Test: Download a file and measure speed
const runRealSpeedTest = () => {
  return new Promise((resolve) => {
    // Using Cloudflare's speed test endpoint (100MB file)
    const testUrl = 'https://speed.cloudflare.com/__down?bytes=10000000'; // 10MB download
    const startTime = Date.now();
    let totalBytes = 0;

    https.get(testUrl, (response) => {
      response.on('data', (chunk) => {
        totalBytes += chunk.length;
      });

      response.on('end', () => {
        const durationSeconds = (Date.now() - startTime) / 1000;
        const speedMbps = ((totalBytes * 8) / (durationSeconds * 1000000)).toFixed(2);
        resolve(Number(speedMbps));
      });

      response.on('error', () => {
        resolve(0);
      });
    }).on('error', () => {
      resolve(0);
    });
  });
};

// Upload Speed Test: Upload data and measure speed
const runUploadSpeedTest = () => {
  return new Promise((resolve) => {
    const testData = Buffer.alloc(2000000, 'a'); // 2MB of data
    const startTime = Date.now();

    const options = {
      hostname: 'speed.cloudflare.com',
      path: '/__up',
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': testData.length
      }
    };

    const req = https.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        const durationSeconds = (Date.now() - startTime) / 1000;
        const speedMbps = ((testData.length * 8) / (durationSeconds * 1000000)).toFixed(2);
        resolve(Number(speedMbps));
      });
    });

    req.on('error', () => {
      resolve(0);
    });

    req.write(testData);
    req.end();
  });
};

// Background Worker: Run Real Speed Test every 60 seconds
setInterval(async () => {
  if (registeredNetworks.size === 0 || isSpeedTestRunning) return;

  try {
    isSpeedTestRunning = true;
    console.log('🔄 Running real speed test...');
    
    realDownloadSpeed = await runRealSpeedTest();
    realUploadSpeed = await runUploadSpeedTest();
    
    console.log(`✅ Speed test done: ⬇️ ${realDownloadSpeed} Mbps | ⬆️ ${realUploadSpeed} Mbps`);
  } catch (err) {
    console.error('❌ Speed test failed:', err.message);
  } finally {
    isSpeedTestRunning = false;
  }
}, 60000);

// Background Worker: Log Network Status Every 5 Seconds to MongoDB
setInterval(async () => {
  if (registeredNetworks.size === 0) return;

  const latency = await measureLatency();
  const devices = await countConnectedDevices();

  for (const [ip, networkName] of registeredNetworks.entries()) {
    try {
      await NetworkLog.create({
        networkName: networkName,
        ipAddress: ip,
        latency: latency || 0,
        downloadSpeed: latency === 0 ? 0 : realDownloadSpeed,
        uploadSpeed: latency === 0 ? 0 : realUploadSpeed,
        connectedDevices: latency === 0 ? 0 : devices,
      });
    } catch (err) {
      console.error('Failed to log network data:', err);
    }
  }
}, 5000);

// --- API ENDPOINTS ---

// Register Network from Setup Page
app.post('/api/network/register', async (req, res) => {
  const { networkName, ipAddress } = req.body;
  if (!networkName || !ipAddress) {
    return res.status(400).json({ error: 'Network name and IP are required' });
  }
  
  registeredNetworks.set(ipAddress, networkName);

  // Run first speed test immediately on register
  if (!isSpeedTestRunning) {
    isSpeedTestRunning = true;
    console.log('🔄 Running initial speed test for new network...');
    realDownloadSpeed = await runRealSpeedTest();
    realUploadSpeed = await runUploadSpeedTest();
    console.log(`✅ Initial speed: ⬇️ ${realDownloadSpeed} Mbps | ⬆️ ${realUploadSpeed} Mbps`);
    isSpeedTestRunning = false;
  }

  res.json({ message: 'Network registered successfully for tracking', ipAddress });
});

// Manual Speed Test Trigger (For Dashboard Button)
app.post('/api/network/speedtest', async (req, res) => {
  if (isSpeedTestRunning) {
    return res.status(429).json({ message: 'A speed test is already running' });
  }
  
  try {
    isSpeedTestRunning = true;
    console.log('🔄 Manual speed test triggered...');
    
    realDownloadSpeed = await runRealSpeedTest();
    realUploadSpeed = await runUploadSpeedTest();
    
    console.log(`✅ Manual test done: ⬇️ ${realDownloadSpeed} Mbps | ⬆️ ${realUploadSpeed} Mbps`);
    res.json({ download: realDownloadSpeed, upload: realUploadSpeed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to run speed test' });
  } finally {
    isSpeedTestRunning = false;
  }
});

// Get Latest Status
app.get('/api/network/status/:ip', async (req, res) => {
  try {
    const latestLog = await NetworkLog.findOne({ ipAddress: req.params.ip }).sort({ timestamp: -1 });
    if (!latestLog) {
      return res.status(404).json({ error: 'No data found for this IP' });
    }
    
    res.json({
      networkName: latestLog.networkName,
      latency: latestLog.latency,
      connectedDevices: latestLog.connectedDevices,
      downloadSpeed: latestLog.downloadSpeed,
      uploadSpeed: latestLog.uploadSpeed,
      isOnline: latestLog.latency > 0,
      healthStatus: latestLog.downloadSpeed > 40 ? "Healthy" : latestLog.downloadSpeed > 15 ? "Degraded" : "Critical",
      isSpeedTestRunning
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Historical Data for Charts
app.get('/api/network/history/:ip', async (req, res) => {
  try {
    const history = await NetworkLog.find({ ipAddress: req.params.ip })
      .sort({ timestamp: -1 })
      .limit(20);
    
    const formattedHistory = history.reverse().map(log => {
      const date = new Date(log.timestamp);
      const timeStr = date.getHours().toString().padStart(2, '0') + ':' + 
                      date.getMinutes().toString().padStart(2, '0') + ':' + 
                      date.getSeconds().toString().padStart(2, '0');
      return {
        time: timeStr,
        speed: log.downloadSpeed,
        latency: log.latency,
      };
    });

    res.json(formattedHistory);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 NetCast AI Node.js Backend running on http://localhost:${PORT}`);
  console.log(`📡 Real speed tests will run every 60 seconds after network registration`);
});
