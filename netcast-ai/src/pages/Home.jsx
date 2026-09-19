import React, { useState, useEffect } from 'react';
import { Wifi, Activity, ShieldCheck, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [networkName, setNetworkName] = useState('Detecting...');
  
  // Simulated connection fetch
  useEffect(() => {
    setTimeout(() => {
      setNetworkName('Home_WiFi_5G');
    }, 1000);
  }, []);

  return (
    <div className="p-6 md:p-10 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time network status</p>
        </div>
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
          <Activity className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Main Status Card */}
      <div className="glass-card p-6 mb-6 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-800/50">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Current Network</p>
            <h2 className="text-2xl font-bold text-white">{networkName}</h2>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold relative z-10">
          <ShieldCheck className="w-4 h-4" />
          Your Network is Stable
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Download</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">45.2</span>
            <span className="text-sm font-bold text-slate-500">Mbps</span>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Upload</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">12.8</span>
            <span className="text-sm font-bold text-slate-500">Mbps</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => navigate('/speedtest')}
        className="w-full md:w-auto md:px-8 glass-button py-4 flex items-center justify-center gap-3 text-lg"
      >
        <Zap className="w-5 h-5 fill-current" />
        Run Full Speed Test
      </button>

    </div>
  );
};

export default Home;
