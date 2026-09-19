import React, { useState, useEffect } from 'react';
import {
  Activity, Zap, Wifi, AlertTriangle, WifiOff, Clock, LogOut,
  Users, Brain, Shield, ArrowDown, ArrowUp, TrendingUp, CheckCircle,
  Download, Moon, Sun, Smartphone, Laptop, Tv, Tablet, HelpCircle,
  Map, Server, Bell, ActivitySquare, AlertCircle, Home,
  Cloud, CloudRain, CloudLightning, Eye, Gauge, LayoutDashboard, ArrowRight, Terminal
, Home, CloudRain, Cloud, CloudLightning, Gauge, X, BarChart, Eye, LayoutDashboard} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
  LineChart, Line, BarChart as RechartsBarChart, Bar
} from 'recharts';
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
  if (count === 1) return [vendors[1]];
  const devices = [];
  for (let i = 0; i < count; i++) {
    const vendorIndex = (i * 17) % vendors.length;
    devices.push({ id: `dev-${i}`, ...vendors[vendorIndex] });
  }
  return devices.slice(0, 5);
};

// AI Prediction Engine
function getAIPrediction(deviceCount, latency) {
  if (deviceCount <= 15 && latency < 30) {
    return {
      status: 'excellent', color: '#22c55e', label: 'Healthy',
      message: 'Network running smoothly. Plenty of capacity remaining.',
      risk: 'LOW', riskScore: 12, confidence: 96,
      recommendations: ['No congestion expected', 'No packet loss detected', 'No reboot required']
    };
  } else if (deviceCount <= 24 || latency >= 30) {
    return {
      status: 'warning', color: '#f59e0b', label: 'Warning',
      message: 'Approaching router limit or experiencing slight delays.',
      risk: 'MODERATE', riskScore: 45, confidence: 88,
      recommendations: ['Monitor active streams', 'Consider disconnecting idle devices', 'Slight congestion likely soon']
    };
  } else {
    return {
      status: 'critical', color: '#ef4444', label: 'Critical',
      message: 'Router is at maximum capacity or experiencing severe lag.',
      risk: 'HIGH', riskScore: 89, confidence: 92,
      recommendations: ['IMMEDIATELY disconnect devices', 'Severe packet loss likely', 'Router restart recommended']
    };
  }
}

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
        <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700/50" />
        <motion.circle
          cx="50" cy="50" r={radius} stroke={color} strokeWidth="8" fill="transparent"
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

// Weather conditions (mock)
const weatherConditions = ['Clear', 'Cloudy', 'Rain', 'Storm'];
const getWeather = () => weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

function Dashboard() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkConfig, setNetworkConfig] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  // Enhancements State
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [isSpeedTestModalOpen, setIsSpeedTestModalOpen] = useState(false);
  const [weatherWarning, setWeatherWarning] = useState(null);
  const [testProgress, setTestProgress] = useState(0);
  
  const latencyHistory = [
    { time: '1', ping: 20 }, { time: '2', ping: 24 }, { time: '3', ping: 18 },
    { time: '4', ping: 25 }, { time: '5', ping: 21 }, { time: '6', ping: 19 },
    { time: '7', ping: 22 }, { time: '8', ping: 20 }
  ];
  
  const appUsageData = [
    { name: 'Netflix', value: 45, fill: '#ef4444' },
    { name: 'YouTube', value: 25, fill: '#f87171' },
    { name: 'Insta', value: 15, fill: '#ec4899' },
    { name: 'System', value: 10, fill: '#3b82f6' },
    { name: 'Other', value: 5, fill: '#94a3b8' }
  ];
  const [weather, setWeather] = useState('Clear');
  const [weatherWarning, setWeatherWarning] = useState(null);
  const [latencyHistory, setLatencyHistory] = useState([
    { t: 1, ping: 20 }, { t: 2, ping: 24 }, { t: 3, ping: 18 },
    { t: 4, ping: 25 }, { t: 5, ping: 21 }, { t: 6, ping: 19 }, { t: 7, ping: 22 }
  ]);

  const [networkData, setNetworkData] = useState({
    networkName: 'AKATHTHIAN-NET', latency: 22, connectedDevices: 8,
    healthStatus: 'Healthy', downloadSpeed: 85, uploadSpeed: 32,
    jitter: 4, packetLoss: 0.2, isSpeedTestRunning: false
  });
  const [speedHistory, setSpeedHistory] = useState([]);
  const navigate = useNavigate();

  const appUsageData = [
    { name: 'Netflix', value: 45 },
    { name: 'YouTube', value: 25 },
    { name: 'Instagram', value: 15 },
    { name: 'System', value: 10 },
    { name: 'Other', value: 5 }
  ];

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather check
  useEffect(() => {
    const w = getWeather();
    setWeather(w);
    if (w === 'Rain' || w === 'Storm') {
      setWeatherWarning(`⚠️ ${w} detected! Network collision & latency spikes expected.`);
    }
  }, []);

  // Simulate latency updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newPing = Math.floor(Math.random() * 40) + 10;
      setNetworkData(prev => ({ ...prev, latency: newPing }));
      setLatencyHistory(prev => {
        const next = [...prev.slice(-6), { t: prev.length + 1, ping: newPing }];
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
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

  const handlePrint = () => window.print();
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Load config
  useEffect(() => {
    const stored = localStorage.getItem('netcast_network');
    if (stored) {
      setNetworkConfig(JSON.parse(stored));
    }
    setLoading(false);
      }
      
      // Weather Collision Logic (Trigger on render)
      const weathers = ['Clear', 'Rain', 'Storm'];
      const currentW = weathers[Math.floor(Math.random() * weathers.length)];
      if (currentW === 'Rain' || currentW === 'Storm') {
        setWeatherWarning("⚠️ Bad weather detected. Network collision & latency spikes expected.");
      } else {
        setWeatherWarning(null);
      }, [navigate]);

  useEffect(() => {
    if (!networkConfig?.ipAddress) return;
    const fetchData = async () => {
      try {
        const statusRes = await fetch(`http://localhost:5000/api/network/status/${networkConfig.ipAddress}`).catch(() => null);
        if (statusRes && statusRes.ok) {
          const statusData = await statusRes.json();
          setNetworkData(statusData);
          setIsOnline(statusData.isOnline);
        }
      } catch (error) {
        console.error('Failed to fetch from backend:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [networkConfig]);

  const prediction = getAIPrediction(networkData.connectedDevices, networkData.latency);
  const speedClass = classifySpeed(networkData.downloadSpeed);

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0f172a]' : 'bg-gray-50';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white shadow-lg border-gray-100';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
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
        <h2 className={`text-xl font-bold ${textMain}`}>Initializing NETISIM...</h2>
        <p className={textMuted}>Analyzing network telemetry</p>
      </div>
    );
  }

  const WeatherIcon = weather === 'Storm' ? CloudLightning : weather === 'Rain' ? CloudRain : Cloud;
  const weatherColor = (weather === 'Storm' || weather === 'Rain') ? '#ef4444' : '#22d3ee';

  return (
    <div className={`min-h-screen p-4 md:p-8 ${bgMain} transition-colors duration-300`}>

      {/* Weather Warning Toast */}
      <AnimatePresence>
        {weatherWarning && (
          <motion.div
            initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/95 text-white px-6 py-3 rounded-full shadow-2xl shadow-red-500/50 font-bold flex items-center gap-3 border-2 border-red-400 cursor-pointer"
            onClick={() => setWeatherWarning(null)}
          >
            <CloudLightning className="animate-pulse" size={18} />
            {weatherWarning}
            <span className="text-red-200 text-xs ml-2">✕ tap to dismiss</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <AnimatePresence>
        {weatherWarning && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-2xl shadow-red-500/50 font-bold flex items-center gap-3 border-2 border-red-400">
            <CloudLightning className="animate-pulse" />
            {weatherWarning}
            <button onClick={() => setWeatherWarning(null)} className="ml-2 hover:text-red-200"><X size={18}/></button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.header
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className={`mb-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="text-blue-500" size={32} />
            {isOnline && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></span>}
          </div>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>NETISIM</h1>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span style={{ color: prediction.color }} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: prediction.color }}></span>
                System {prediction.label}
              </span>
              <span className={textMuted}>| v1.0 Enterprise</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden md:flex flex-col items-end ${textMuted} text-sm font-medium`}>
            <div className="flex items-center gap-1"><Clock size={14} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div>{currentTime.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>
          <div className="h-8 w-px bg-gray-600/30 hidden md:block"></div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/welcome')} className={`p-2 rounded-lg hover:bg-gray-500/10 ${textMuted} transition flex items-center gap-1 text-sm`} title="Home">
              <Home size={18} /> <span className="hidden lg:block">Home</span>
            </button>
            <button onClick={() => navigate('/welcome')} className={`p-2 rounded-lg hover:bg-gray-500/10 ${textMuted} transition font-bold flex items-center gap-2`} title="Back to Home">
              <Home size={20} /> <span className="hidden lg:block text-sm">Home</span>
            </button>
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
              {networkData.downloadSpeed}<span className={`text-sm ${textMuted} font-normal ml-1`}>Mbps</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-500">
              <TrendingUp size={14} /> {speedClass.trend}
            </div>
            <button
              onClick={() => navigate('/speedtest')}
              className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 transition-all"
            >
              <Gauge size={14} /> Run Speed Test
            </button>
          </motion.div>

          {/* Upload Speed */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`${textMuted} font-medium text-sm flex items-center gap-2`}>
                <ArrowUp className="text-purple-500" size={16} /> Upload
              </h3>
            </div>
            <div className={`text-4xl font-bold ${textMain} tracking-tight`}>
              {networkData.uploadSpeed}<span className={`text-sm ${textMuted} font-normal ml-1`}>Mbps</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-500">
              Stable connection
            </div>
            <button onClick={() => setIsSpeedTestModalOpen(true)} className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 transition-all">
              <Gauge size={16} /> Premium Speed Test
            </button>
          </motion.div>

          {/* Latency with Sparkline */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <h3 className={`${textMuted} font-medium text-sm flex items-center gap-2 mb-4`}>
              <Zap className="text-amber-500" size={16} /> Latency
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <div className={`text-4xl font-bold ${textMain} tracking-tight`}>
                  {networkData.latency}<span className={`text-sm ${textMuted} font-normal ml-1`}>ms</span>
                </div>
                <div className={`mt-2 text-xs font-medium ${networkData.latency < 40 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {networkData.latency < 40 ? 'Excellent' : 'High delay'}
                </div>
              </div>
              <div className="h-14 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyHistory}>
                    <Line type="monotone" dataKey="ping" stroke="#eab308" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <button
              onClick={() => navigate('/latency')}
              className={`mt-4 w-full py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2`}
            >
              <Activity size={12} /> Full Latency Analysis
            </button>
          </motion.div>

          {/* Connected Devices */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className={`${textMuted} font-medium text-sm flex items-center gap-2`}>
                <Users className="text-cyan-500" size={16} /> Connected Devices
              </h3>
              <span className={`${textMuted} text-xs font-bold`}>{networkData.connectedDevices} / 30</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 mb-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((networkData.connectedDevices / 30) * 100, 100)}%`, backgroundColor: prediction.color }}
              ></div>
            </div>
            <div className={`text-3xl font-bold ${textMain} mb-1`}>{networkData.connectedDevices}</div>
            <button
              onClick={() => navigate('/devices')}
              className="mt-3 w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg font-bold text-xs flex justify-center items-center gap-2 transition-all"
            >
              <Eye size={12} /> View All Devices
            </button>
          </motion.div>
        </div>

        {/* Secondary Row: Health + Weather + Packet Loss + Jitter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Network Health */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg} flex items-center justify-between`}>
            <div>
              <h3 className={`text-lg font-bold ${textMain} mb-1`}>Network Health</h3>
              <p className={`text-sm ${textMuted} mb-4`}>AI Assessment</p>
              <div className="px-3 py-1 rounded-full text-xs font-bold inline-block" style={{ backgroundColor: `${prediction.color}20`, color: prediction.color }}>
                {prediction.label.toUpperCase()}
              </div>
              <button
                onClick={() => navigate('/diagnostics')}
                className="mt-4 w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg font-bold text-xs flex justify-center items-center gap-2 transition-all"
              >
                <Terminal size={12} /> DPI & OSI Diagnostics
              </button>
            </div>
            <CircularGauge percentage={Math.max(10, 100 - (prediction.riskScore || 0))} color={prediction.color} />
          </motion.div>

          {/* Weather Widget */}
          <motion.div
            variants={itemVariants}
            className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-center`}
            style={{ borderColor: (weather === 'Rain' || weather === 'Storm') ? '#ef4444' : undefined }}
          >
            <div className="flex items-center gap-2 mb-2">
              <WeatherIcon size={24} style={{ color: weatherColor }} />
              <h3 className={`${textMuted} font-medium text-sm`}>Live Weather</h3>
            </div>
            <div className={`text-3xl font-bold ${textMain}`}>{weather}</div>
            <p className={`text-xs mt-2 font-bold`} style={{ color: weatherColor }}>
              {(weather === 'Rain' || weather === 'Storm') ? '⚠️ Network Collision Risk!' : '✅ Conditions Optimal'}
            </p>
          </motion.div>

          {/* Packet Loss */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-center`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-orange-400" size={18} />
              <h3 className={`${textMuted} font-medium text-sm`}>Packet Loss</h3>
            </div>
            <div className={`text-3xl font-bold ${textMain}`}>{networkData.packetLoss}<span className="text-lg ml-1">%</span></div>
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
            <div className={`text-3xl font-bold ${textMain}`}>{networkData.jitter}<span className="text-lg ml-1 text-gray-500 font-normal">ms</span></div>
            <p className={`text-xs mt-2 ${networkData.jitter < 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {networkData.jitter < 10 ? 'Stable consistency' : 'Connection fluctuating'}
            </p>
          </motion.div>
        </div>

        {/* AI + App Usage Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* AI Prediction */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`} style={{ borderColor: `${prediction.color}40` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${prediction.color}20` }}>
                <Brain size={24} style={{ color: prediction.color }} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${textMain}`}>AI Prediction Engine</h3>
                <p className={`text-xs ${textMuted}`}>Confidence: {prediction.confidence}%</p>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className={textMuted}>Risk Score</span>
                <span className="font-bold" style={{ color: prediction.color }}>{prediction.risk} ({prediction.riskScore}%)</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="h-2 rounded-full" style={{ width: `${prediction.riskScore}%`, backgroundColor: prediction.color }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-2`}>Recommendations</h4>
              {prediction.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className={`text-sm ${textMain}`}>{rec}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* App Data Absorption */}
          <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
            <h3 className={`text-xl font-bold ${textMain} mb-1 flex items-center gap-2`}>
              <LayoutDashboard size={22} className="text-pink-500" /> Data Absorption
            </h3>
            <p className={`text-sm ${textMuted} mb-6`}>Apps consuming your bandwidth</p>
            <div className="space-y-4">
              {appUsageData.map((app, i) => {
                const colors = ['#ef4444', '#f97316', '#ec4899', '#3b82f6', '#94a3b8'];
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-medium ${textMain}`}>{app.name}</span>
                      <span className={`text-sm font-bold`} style={{ color: colors[i] }}>{app.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${app.value}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: colors[i] }}
                      ></motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Smart Alerts */}
        <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className={`text-lg font-bold ${textMain} mb-4 flex items-center gap-2`}>
            <Bell size={20} className="text-amber-500" /> Smart Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Shield className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-emerald-500">Network Stable</p>
                <p className={`text-xs ${textMuted} mt-1`}>{new Date(Date.now() - 50000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <ArrowDown className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-amber-500">Upload speed dropped 10%</p>
                <p className={`text-xs ${textMuted} mt-1`}>{new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Zap className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-red-500">High latency spike (85ms)</p>
                <p className={`text-xs ${textMuted} mt-1`}>Yesterday</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer variants={itemVariants} className={`mt-8 py-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500" size={20} />
            <span className={`font-bold ${textMain}`}>NETISIM</span>
            <span className={textMuted}>© 2026</span>
          </div>
          <div className={`flex flex-wrap gap-4 text-sm ${textMuted} items-center`}>
            <span>NETISIM v1.0</span>
            <span className="flex items-center gap-1"><Server size={14} className="text-emerald-500" /> Backend Connected</span>
            <span>Last Updated: {currentTime.toLocaleTimeString()}</span>
            <button
              onClick={() => navigate('/docs')}
              className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-purple-400 px-4 py-2 rounded-lg font-bold text-xs transition-all"
            >
              📄 View Documentation
            </button>
          </div>
        </motion.footer>

      </motion.div>
    </div>
  );
}

export default Dashboard;
