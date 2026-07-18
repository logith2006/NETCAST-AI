import React, { useState, useEffect } from 'react';
import {
  Activity, Zap, Wifi, AlertTriangle, WifiOff, Clock, LogOut,
  Users, Brain, Shield, ArrowDown, ArrowUp, TrendingUp, CheckCircle,
  Download, Moon, Sun, Smartphone, Laptop, Tv, Tablet, HelpCircle,
  Map, Server, Bell, ActivitySquare, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Device Vendors Generator
const generateMockDevices = (count) => {
  const vendors = [
    { name: 'Samsung S23', icon: Smartphone },
    { name: 'Desktop PC', icon: Server },
    { name: 'MacBook Pro', icon: Laptop },
    { name: 'Smart TV', icon: Tv },
    { name: 'iPad Air', icon: Tablet },
    { name: 'Unknown Device', icon: HelpCircle }
  ];
  
  if (count === 0) return [];
  if (count === 1) return [vendors[1]]; // Just the desktop

  const devices = [];
  for (let i = 0; i < count; i++) {
    // Deterministic random based on index
    const vendorIndex = (i * 17) % vendors.length; 
    devices.push({ id: `dev-${i}`, ...vendors[vendorIndex] });
  }
  return devices.slice(0, 5); // Show top 5 max
};

// AI Prediction Engine (Customized for AKATHTHIAN network - 30 Device Limit)
function getAIPrediction(deviceCount, latency) {
  if (deviceCount <= 15 && latency < 30) {
    return {
      status: 'excellent',
      color: '#22c55e',
      label: 'Healthy',
      message: 'Network running smoothly. Plenty of capacity remaining.',
      risk: 'LOW',
      riskScore: 12,
      confidence: 96,
      recommendations: [
        'No congestion expected',
        'No packet loss detected',
        'No reboot required'
      ]
    };
  } else if (deviceCount <= 24 || latency >= 30) {
    return {
      status: 'warning',
      color: '#f59e0b',
      label: 'Warning',
      message: 'Approaching router limit or experiencing slight delays.',
      risk: 'MODERATE',
      riskScore: 45,
      confidence: 88,
      recommendations: [
        'Monitor active streams',
        'Consider disconnecting idle devices',
        'Slight congestion likely soon'
      ]
    };
  } else {
    return {
      status: 'critical',
      color: '#ef4444',
      label: 'Critical',
      message: 'Router is at maximum capacity or experiencing severe lag.',
      risk: 'HIGH',
      riskScore: 89,
      confidence: 92,
      recommendations: [
        'IMMEDIATELY disconnect devices',
        'Severe packet loss likely',
        'Router restart recommended'
      ]
    };
  }
}

// Speed classification
function classifySpeed(speedMbps) {
  if (speedMbps >= 50) return { label: 'Fast', color: '#22c55e', icon: '🚀', trend: '+2.1% from last hour' };
  if (speedMbps >= 20) return { label: 'Moderate', color: '#3b82f6', icon: '⚡', trend: 'Stable' };
  if (speedMbps >= 5) return { label: 'Slow', color: '#f59e0b', icon: '🐌', trend: '-1.4% from last hour' };
  if (speedMbps > 0) return { label: 'Very Slow', color: '#ef4444', icon: '🔴', trend: 'Critical drop' };
  return { label: 'No Connection', color: '#6b7280', icon: '❌', trend: 'Offline' };
}

// Circular Gauge Component
const CircularGauge = ({ percentage, color }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="100" height="100" className="transform -rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          stroke="currentColor" strokeWidth="8" fill="transparent"
          className="text-gray-700/50"
        />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={color} strokeWidth="8" fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>{percentage}%</span>
      </div>
    </div>
  );
};

function Dashboard() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkConfig, setNetworkConfig] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  const [networkData, setNetworkData] = useState({
    networkName: 'Unknown',
    latency: 0,
    connectedDevices: 0,
    healthStatus: 'Checking...',
    downloadSpeed: 0,
    uploadSpeed: 0,
    jitter: 0,
    packetLoss: 0,
    isSpeedTestRunning: false
  });
  
  const [speedHistory, setSpeedHistory] = useState([]);
  const navigate = useNavigate();

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('netcast_network');
      navigate('/login');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Load config & Data polling
  useEffect(() => {
    const stored = localStorage.getItem('netcast_network');
    if (stored) {
      setNetworkConfig(JSON.parse(stored));
    } else {
      navigate('/setup');
    }
  }, [navigate]);

  useEffect(() => {
    if (!networkConfig || !networkConfig.ipAddress) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const fetchData = async () => {
      try {
        const statusRes = await fetch(`http://localhost:8080/api/network/status/${networkConfig.ipAddress}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setNetworkData(statusData);
          setIsOnline(statusData.isOnline);
        }

        const historyRes = await fetch(`http://localhost:8080/api/network/history/${networkConfig.ipAddress}`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setSpeedHistory(historyData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch from backend:', error);
      }
    };

    fetchData(); 
    const interval = setInterval(fetchData, 5000); 

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [networkConfig]);

  const prediction = getAIPrediction(networkData.connectedDevices, networkData.latency);
  const speedClass = classifySpeed(networkData.downloadSpeed);
  
  // Forecast Data with 3 lines (Actual, Prediction, Threshold)
  const forecastData = [
    { time: 'Now', actual: networkData.latency, predicted: networkData.latency, threshold: 50 },
    { time: '+10m', predicted: Math.round(networkData.latency * 1.15), threshold: 50 },
    { time: '+20m', predicted: Math.round(networkData.latency * 1.6), threshold: 50 },
    { time: '+30m', predicted: Math.round(networkData.latency * 2.2), threshold: 50 },
    { time: '+40m', predicted: Math.round(networkData.latency * 1.8), threshold: 50 },
  ];

  // Theme Styles
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0f172a]' : 'bg-gray-50';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white shadow-lg border-gray-100';
  const cardText = isDark ? 'text-white' : 'text-gray-800';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${bgMain}`}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Activity size={48} className="text-blue-500 mb-4" />
        </motion.div>
        <h2 className={`text-xl font-bold ${textMain}`}>Initializing NetCast AI...</h2>
        <p className={textMuted}>Analyzing network telemetry</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${bgMain} transition-colors duration-300`}>
      
      {/* Navbar */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`mb-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="text-blue-500" size={32} />
            {isOnline && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></span>}
          </div>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>NetCast AI</h1>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span style={{ color: prediction.color }} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: prediction.color }}></span>
                System {prediction.label}
              </span>
              <span className={textMuted}>| v1.0 Enterprise</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Clock & Date */}
          <div className={`hidden md:flex flex-col items-end ${textMuted} text-sm font-medium`}>
            <div className="flex items-center gap-1">
              <Clock size={14} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>{currentTime.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>

          <div className="h-8 w-px bg-gray-600/30 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`p-2 rounded-lg hover:bg-gray-500/10 ${textMuted} transition`}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handlePrint} className={`p-2 rounded-lg hover:bg-gray-500/10 ${textMuted} transition`} title="Export PDF">
              <Download size={20} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition font-medium text-sm border border-red-500/20">
              <LogOut size={16} /> Disconnect
            </button>
          </div>
        </div>
      </motion.header>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6">
        
        {/* Core Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Download Speed */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`${textMuted} font-medium text-sm flex items-center gap-2`}>
                <ArrowDown className="text-blue-500" size={16} /> Download
              </h3>
            </div>
            <div className={`text-4xl font-bold ${textMain} tracking-tight`}>
              {networkData.isSpeedTestRunning ? '--' : networkData.downloadSpeed}
              <span className={`text-sm ${textMuted} font-normal ml-1`}>Mbps</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-500">
              <TrendingUp size={14} /> {speedClass.trend}
            </div>
          </motion.div>

          {/* Upload Speed */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`${textMuted} font-medium text-sm flex items-center gap-2`}>
                <ArrowUp className="text-purple-500" size={16} /> Upload
              </h3>
            </div>
            <div className={`text-4xl font-bold ${textMain} tracking-tight`}>
              {networkData.isSpeedTestRunning ? '--' : networkData.uploadSpeed}
              <span className={`text-sm ${textMuted} font-normal ml-1`}>Mbps</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-500">
              Stable connection
            </div>
          </motion.div>

          {/* Real-time Latency */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`${textMuted} font-medium text-sm flex items-center gap-2`}>
                <Zap className="text-amber-500" size={16} /> Latency
              </h3>
            </div>
            <div className={`text-4xl font-bold ${textMain} tracking-tight`}>
              {networkData.latency}
              <span className={`text-sm ${textMuted} font-normal ml-1`}>ms</span>
            </div>
            <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${networkData.latency < 40 ? 'text-emerald-500' : 'text-red-500'}`}>
              {networkData.latency < 40 ? 'Excellent response time' : 'High delay detected'}
            </div>
          </motion.div>

          {/* Connected Devices */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`${textMuted} font-medium text-sm flex items-center gap-2`}>
                <Users className="text-cyan-500" size={16} /> Connected Devices
              </h3>
              <span className={`${textMuted} text-xs font-bold`}>{networkData.connectedDevices} / 30</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700/50 rounded-full h-3 mt-4 mb-2 overflow-hidden">
              <div 
                className="h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min((networkData.connectedDevices / 30) * 100, 100)}%`,
                  backgroundColor: prediction.color
                }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className={`text-2xl font-bold ${textMain}`}>{networkData.connectedDevices}</span>
              <span className={`text-xs font-medium ${textMuted}`}>
                {Math.round((networkData.connectedDevices / 30) * 100)}% Utilization
              </span>
            </div>
          </motion.div>
        </div>

        {/* Secondary Metrics Row (Jitter, Packet Loss, Health) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Network Health */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg} flex items-center justify-between`}>
            <div>
              <h3 className={`text-lg font-bold ${textMain} mb-1`}>Network Health</h3>
              <p className={`text-sm ${textMuted} mb-4`}>Overall AI Assessment</p>
              <div className="px-3 py-1 rounded-full text-xs font-bold inline-block" style={{ backgroundColor: `${prediction.color}20`, color: prediction.color }}>
                {prediction.label.toUpperCase()}
              </div>
            </div>
            <CircularGauge percentage={Math.max(10, 100 - (prediction.riskScore || 0))} color={prediction.color} />
          </motion.div>

          {/* Packet Loss */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-center`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-orange-400" size={18} />
              <h3 className={`${textMuted} font-medium text-sm`}>Packet Loss</h3>
            </div>
            <div className={`text-3xl font-bold ${textMain}`}>
              {networkData.packetLoss}<span className="text-lg ml-1">%</span>
            </div>
            <p className={`text-xs mt-2 ${Number(networkData.packetLoss) < 1 ? 'text-emerald-500' : 'text-red-500'}`}>
              {Number(networkData.packetLoss) < 1 ? 'Data transmission perfect' : 'Packets are dropping'}
            </p>
          </motion.div>

          {/* Jitter */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-center`}>
            <div className="flex items-center gap-2 mb-2">
              <ActivitySquare className="text-pink-400" size={18} />
              <h3 className={`${textMuted} font-medium text-sm`}>Network Jitter</h3>
            </div>
            <div className={`text-3xl font-bold ${textMain}`}>
              {networkData.jitter}<span className="text-lg ml-1 text-gray-500 font-normal">ms</span>
            </div>
            <p className={`text-xs mt-2 ${networkData.jitter < 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {networkData.jitter < 10 ? 'Stable connection consistency' : 'Connection fluctuating'}
            </p>
          </motion.div>
        </div>

        {/* AI & Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Advanced AI Prediction */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg} lg:col-span-1`} style={{ borderColor: `${prediction.color}40` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${prediction.color}20` }}>
                <Brain size={24} style={{ color: prediction.color }} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${textMain}`}>AI Prediction</h3>
                <p className={`text-xs ${textMuted}`}>Confidence: {prediction.confidence}%</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className={textMuted}>AI Risk Score</span>
                <span className="font-bold" style={{ color: prediction.color }}>{prediction.risk} ({prediction.riskScore}%)</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="h-2 rounded-full" style={{ width: `${prediction.riskScore}%`, backgroundColor: prediction.color }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-2`}>AI Recommendations</h4>
              {prediction.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className={`text-sm ${textMain}`}>{rec}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Advanced Area Chart */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg} lg:col-span-2 min-h-[400px] flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className={`text-lg font-bold ${textMain}`}>Latency Forecast Analysis</h3>
                <p className={`text-sm ${textMuted}`}>Predictive modeling based on current load</p>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                  <XAxis dataKey="time" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '12px' }} 
                    itemStyle={{ color: isDark ? '#fff' : '#000' }} 
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <ReferenceLine y={50} label={{ position: 'insideTopLeft', value: 'Congestion Threshold', fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                  
                  <Area type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Latency (ms)" connectNulls />
                  <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted Latency" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Tables & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Smart Alerts & Notifications */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <h3 className={`text-lg font-bold ${textMain} mb-4 flex items-center gap-2`}>
              <Bell size={20} className="text-amber-500" />
              Smart Alerts
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Shield className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className={`text-sm font-bold text-emerald-500`}>Network Stable</p>
                  <p className={`text-xs ${textMuted} mt-1`}>{new Date(Date.now() - 50000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              
              <div className="flex gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <ArrowDown className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className={`text-sm font-bold text-amber-500`}>Upload speed dropped 10%</p>
                  <p className={`text-xs ${textMuted} mt-1`}>{new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <Zap className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className={`text-sm font-bold text-red-500`}>High latency spike (85ms)</p>
                  <p className={`text-xs ${textMuted} mt-1`}>Yesterday</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Forecast Table */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <h3 className={`text-lg font-bold ${textMain} mb-4`}>Forecast Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${textMuted}`}>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Predicted</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className={`${textMain}`}>
                  <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <td className="py-3">+10 min</td>
                    <td className="py-3">{Math.round(networkData.latency * 1.15)} ms</td>
                    <td className="py-3 text-emerald-500">Normal</td>
                  </tr>
                  <tr className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <td className="py-3">+20 min</td>
                    <td className="py-3">{Math.round(networkData.latency * 1.6)} ms</td>
                    <td className="py-3 text-amber-500">Moderate</td>
                  </tr>
                  <tr>
                    <td className="py-3">+30 min</td>
                    <td className="py-3">{Math.round(networkData.latency * 2.2)} ms</td>
                    <td className="py-3 text-red-500">Warning</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Connected Devices Vendors */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <h3 className={`text-lg font-bold ${textMain} mb-4 flex items-center justify-between`}>
              <span>Devices Snapshot</span>
              <span className={`text-xs px-2 py-1 bg-gray-700/30 rounded-md ${textMuted}`}>Top 5</span>
            </h3>
            <div className="space-y-3">
              {generateMockDevices(networkData.connectedDevices).map((dev, i) => {
                const Icon = dev.icon;
                return (
                  <div key={dev.id} className="flex items-center justify-between p-2 hover:bg-gray-700/20 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Icon size={16} />
                      </div>
                      <span className={`text-sm font-medium ${textMain}`}>{dev.name}</span>
                    </div>
                    <span className={`text-xs ${textMuted}`}>Active</span>
                  </div>
                );
              })}
              {networkData.connectedDevices === 0 && (
                <div className={`text-sm ${textMuted} text-center py-4`}>No devices found.</div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <motion.footer variants={itemVariants} className={`mt-8 py-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500" size={20} />
            <span className={`font-bold ${textMain}`}>NetCast AI</span>
            <span className={textMuted}>© 2026</span>
          </div>
          <div className={`flex gap-6 text-sm ${textMuted}`}>
            <span>Version 1.0 Enterprise</span>
            <span className="flex items-center gap-1"><Server size={14} className="text-emerald-500"/> Backend Connected</span>
            <span>Last Updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </motion.footer>

      </motion.div>
    </div>
  );
}

export default Dashboard;
