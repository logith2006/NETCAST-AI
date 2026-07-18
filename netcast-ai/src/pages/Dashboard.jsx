import React, { useState, useEffect } from 'react';
import {
  Activity, Zap, Wifi, AlertTriangle, WifiOff, Clock, LogOut,
  Users, Brain, Shield, ArrowDown, ArrowUp, TrendingUp, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// AI Prediction Engine (Customized for AKATHTHIAN network - 30 Device Limit)
function getAIPrediction(deviceCount, currentSpeed) {
  if (deviceCount <= 15) {
    return {
      status: 'excellent',
      color: '#22c55e',
      label: '✅ Excellent',
      message: `Network running smoothly with ${deviceCount} devices. Plenty of capacity remaining (Max 30).`,
      risk: 'LOW',
      recommendation: 'All systems normal. No action needed.',
    };
  } else if (deviceCount <= 24) {
    return {
      status: 'warning',
      color: '#f59e0b',
      label: '⚠️ Warning',
      message: `${deviceCount} devices connected. Approaching router limit (30). Speed reduction possible.`,
      risk: 'MODERATE',
      recommendation: 'Monitor usage. Consider disconnecting idle devices to prevent congestion.',
    };
  } else if (deviceCount <= 30) {
    return {
      status: 'critical',
      color: '#ef4444',
      label: '🔴 Critical',
      message: `${deviceCount} devices detected! Router is at maximum capacity (30). Severe congestion likely.`,
      risk: 'HIGH',
      recommendation: 'IMMEDIATELY disconnect devices to prevent router crash and packet loss.',
    };
  } else {
    return {
      status: 'critical',
      color: '#7f1d1d',
      label: '❌ Overloaded',
      message: `${deviceCount} devices connected! Router capacity EXCEEDED (Max 30). Network failure imminent.`,
      risk: 'CRITICAL',
      recommendation: 'Network overloaded. Disconnect at least ' + (deviceCount - 20) + ' devices immediately.',
    };
  }
}

// Speed classification
function classifySpeed(speedMbps) {
  if (speedMbps >= 50) return { label: 'Fast', color: '#22c55e', icon: '🚀' };
  if (speedMbps >= 20) return { label: 'Moderate', color: '#3b82f6', icon: '⚡' };
  if (speedMbps >= 5) return { label: 'Slow', color: '#f59e0b', icon: '🐌' };
  if (speedMbps > 0) return { label: 'Very Slow', color: '#ef4444', icon: '🔴' };
  return { label: 'No Connection', color: '#6b7280', icon: '❌' };
}

function Dashboard() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkConfig, setNetworkConfig] = useState(null);
  const [networkData, setNetworkData] = useState({
    networkName: 'Unknown',
    latency: 0,
    connectedDevices: 0,
    healthStatus: 'Checking...',
    downloadSpeed: 0,
    uploadSpeed: 0,
  });
  const [speedHistory, setSpeedHistory] = useState([]);
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('netcast_network');
      navigate('/login');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  // Load network config
  useEffect(() => {
    const stored = localStorage.getItem('netcast_network');
    if (stored) {
      try {
        setNetworkConfig(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse network config', e);
      }
    } else {
      // If no network config, redirect to setup
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
        // Fetch Live Status
        const statusRes = await fetch(`http://localhost:8080/api/network/status/${networkConfig.ipAddress}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setNetworkData(statusData);
          setIsOnline(statusData.isOnline);
        }

        // Fetch History
        const historyRes = await fetch(`http://localhost:8080/api/network/history/${networkConfig.ipAddress}`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setSpeedHistory(historyData);
        }
      } catch (error) {
        console.error('Failed to fetch from backend:', error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [networkConfig]);

  const prediction = getAIPrediction(networkData.connectedDevices, networkData.downloadSpeed);
  const speedClass = classifySpeed(networkData.downloadSpeed);

  // Forecast data (based on current latency)
  const forecastData = [
    { time: 'Now', latency: networkData.latency, baseline: 25 },
    { time: '+10m', latency: Math.round(networkData.latency * 1.15), baseline: 25 },
    { time: '+20m', latency: Math.round(networkData.latency * 1.6), baseline: 25 },
    { time: '+30m', latency: Math.round(networkData.latency * 2.2), baseline: 25 },
    { time: '+40m', latency: Math.round(networkData.latency * 2.8), baseline: 25 },
    { time: '+50m', latency: Math.round(networkData.latency * 1.8), baseline: 25 },
    { time: '+60m', latency: Math.round(networkData.latency * 1.1), baseline: 25 },
  ];

  const handleManualSpeedTest = async () => {
    try {
      await fetch('http://localhost:8080/api/network/speedtest', { method: 'POST' });
    } catch (error) {
      console.error('Failed to trigger speed test', error);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-background">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <Activity className="text-blue-400" size={32} />
            NetCast AI
          </h1>
          <p className="text-gray-400 mt-1">Network Weather Forecasting & Congestion Prediction</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isOnline ? (
            <div className="flex items-center gap-2 bg-emerald-500/15 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/25 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              System Online ({networkData.healthStatus})
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-500/15 text-red-400 px-4 py-2 rounded-full border border-red-500/25 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              Network Offline
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {networkConfig && (
              <div className="flex items-center gap-1">
                <Wifi size={14} className="text-blue-400" />
                <span>{networkConfig.networkName}</span>
                <span className="text-gray-600 mx-1">|</span>
                <span className="text-gray-500">{networkConfig.ipAddress}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Card 1: Speed */}
        <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium text-sm">Download Speed</h3>
            <div className="p-2 rounded-lg" style={{ background: speedClass.color + '20' }}>
              <ArrowDown style={{ color: speedClass.color }} size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white flex flex-col">
            {networkData.isSpeedTestRunning ? (
              <span className="text-blue-400 text-xl animate-pulse">Testing...</span>
            ) : (
              <div>
                {isOnline ? networkData.downloadSpeed : '--'}
                <span className="text-sm text-gray-400 font-normal ml-1">Mbps</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: speedClass.color + '20', color: speedClass.color }}>
              {speedClass.icon} {speedClass.label}
            </span>
            <button 
              onClick={handleManualSpeedTest}
              disabled={networkData.isSpeedTestRunning}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition disabled:opacity-50"
            >
              {networkData.isSpeedTestRunning ? 'Running...' : 'Run Test'}
            </button>
          </div>
        </div>

        {/* Card 2: Upload Speed */}
        <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium text-sm">Upload Speed</h3>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ArrowUp className="text-blue-400" size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {isOnline ? networkData.uploadSpeed : '--'}
            <span className="text-sm text-gray-400 font-normal ml-1">Mbps</span>
          </div>
          <p className="text-gray-500 text-xs mt-2">Updated every 5s</p>
        </div>

        {/* Card 3: Latency */}
        <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium text-sm">Real-time Latency</h3>
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Zap className="text-amber-400" size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {isOnline ? networkData.latency : '--'}
            <span className="text-sm text-gray-400 font-normal ml-1">ms</span>
          </div>
          <p className="text-xs mt-2" style={{ color: networkData.latency > 50 ? '#ef4444' : '#22c55e' }}>
            {networkData.latency > 50 ? 'High latency detected' : 'Ping is normal'}
          </p>
        </div>

        {/* Card 4: Connected Devices */}
        <div className="p-6 rounded-2xl border border-white/10" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium text-sm">Connected Devices</h3>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="text-purple-400" size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {isOnline ? networkData.connectedDevices : '0'}
          </div>
          <p className="text-gray-500 text-xs mt-2">Active on backend scan</p>
        </div>
      </div>

      {/* Second Row: AI Prediction + Forecast Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* AI Prediction Card */}
        <div className="p-6 rounded-2xl border" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', borderColor: prediction.color + '30' }}>
          <div className="flex items-center gap-3 mb-4">
            <Brain size={24} style={{ color: prediction.color }} />
            <h3 className="text-lg font-semibold text-white">AI Prediction</h3>
          </div>
          <div className="px-3 py-1.5 rounded-lg text-sm font-bold inline-block mb-4" style={{ background: prediction.color + '20', color: prediction.color }}>
            Risk: {prediction.risk}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">{prediction.message}</p>
          <div className="p-3 rounded-xl border border-white/5" style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
            <p className="text-xs text-gray-400 mb-1 font-medium">💡 AI Recommendation:</p>
            <p className="text-xs text-gray-300">{prediction.recommendation}</p>
          </div>
        </div>

        {/* Latency Forecast Chart */}
        <div className="p-6 rounded-2xl border border-white/10 col-span-1 md:col-span-2 min-h-[350px] flex flex-col" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Latency Forecast (Next 60 Mins)</h3>
              <p className="text-sm text-gray-400">AI-predicted network performance</p>
            </div>
            {isOnline && networkData.latency > 50 && (
              <div className="px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-lg text-sm font-medium animate-pulse">
                Congestion Detected!
              </div>
            )}
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isOnline ? "#ef4444" : "#475569"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={isOnline ? "#ef4444" : "#475569"} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isOnline ? "#22c55e" : "#475569"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isOnline ? "#22c55e" : "#475569"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="baseline" stroke={isOnline ? "#22c55e" : "#475569"} strokeWidth={2} fillOpacity={1} fill="url(#colorBaseline)" name="Normal Baseline" />
                <Area type="monotone" dataKey="latency" stroke={isOnline ? "#ef4444" : "#475569"} strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" name="Predicted Latency" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row: Speed History + Smart Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Speed History Chart */}
        <div className="p-6 rounded-2xl border border-white/10 min-h-[300px] flex flex-col" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Live Speed History</h3>
          </div>
          {speedHistory.length > 0 ? (
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={speedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" name="Speed (Mbps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Waiting for backend data...
            </div>
          )}
        </div>

        {/* Smart Alerts */}
        <div className="p-6 rounded-2xl border border-white/10 flex flex-col gap-4" style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}>
          <h3 className="font-semibold text-lg flex items-center gap-2 text-white">
            <AlertTriangle className="text-amber-400" size={20} />
            Smart Alerts
          </h3>

          {!isOnline && (
            <div className="bg-red-500/15 border border-red-500/30 p-4 rounded-xl animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <WifiOff className="text-red-400" size={22} />
                <p className="text-red-400 font-bold">CRITICAL: Network Disconnected!</p>
              </div>
              <p className="text-gray-300 text-sm">Internet connection lost. Waiting for network to restore...</p>
            </div>
          )}

          {isOnline && prediction.status === 'critical' && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <p className="text-red-400 text-sm font-bold">🔴 Packet Collision Risk!</p>
                <span className="text-xs text-red-400/70">Right Now</span>
              </div>
              <p className="text-gray-300 text-xs mt-2">
                {networkData.connectedDevices} devices are causing severe congestion. Disconnect {networkData.connectedDevices - 15} devices immediately.
              </p>
            </div>
          )}

          {isOnline && prediction.status === 'warning' && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <p className="text-amber-400 text-sm font-bold">⚠️ Congestion Warning</p>
                <span className="text-xs text-amber-400/70">In ~15 mins</span>
              </div>
              <p className="text-gray-300 text-xs mt-2">
                {networkData.connectedDevices} devices detected. Speed degradation expected. Consider reducing connected devices.
              </p>
            </div>
          )}

          {isOnline && networkData.latency > 50 && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <p className="text-red-400 text-sm font-bold">⚡ High Latency Detected</p>
                <span className="text-xs text-red-400/70">Right Now</span>
              </div>
              <p className="text-gray-300 text-xs mt-2">
                Ping is {networkData.latency}ms. Connection is experiencing delays.
              </p>
            </div>
          )}

          {isOnline && prediction.status === 'excellent' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
              <div className="flex justify-between items-start">
                <p className="text-emerald-400 text-sm font-bold">✅ Network Healthy</p>
                <span className="text-xs text-emerald-400/70">Current</span>
              </div>
              <p className="text-gray-300 text-xs mt-2">
                Everything looks good! Speed is {speedClass.label.toLowerCase()} and latency is within normal range.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
