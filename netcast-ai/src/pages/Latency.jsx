import React, { useState, useEffect } from 'react';
import { Activity, ArrowLeft, Zap, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Latency = () => {
  const navigate = useNavigate();
  const [latency, setLatency] = useState(22);

  // Simulate real-time latency changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 40) + 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const forecastData = [
    { time: 'Now', actual: latency, predicted: latency, threshold: 50 },
    { time: '+10m', predicted: Math.round(latency * 1.15), threshold: 50 },
    { time: '+20m', predicted: Math.round(latency * 1.6), threshold: 50 },
    { time: '+30m', predicted: Math.round(latency * 2.2), threshold: 50 },
    { time: '+40m', predicted: Math.round(latency * 1.8), threshold: 50 },
  ];

  const getStatus = (val) => {
    if (val < 30) return { label: 'Normal', color: 'text-emerald-500' };
    if (val < 50) return { label: 'Moderate', color: 'text-amber-500' };
    return { label: 'Warning', color: 'text-red-500' };
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-1">
                <div className="p-3 bg-yellow-500/20 rounded-2xl">
                  <Activity className="text-yellow-400" size={28} />
                </div>
                Latency Forecast Analysis
              </h1>
              <p className="text-gray-400 ml-16">Real-time & predictive network response modeling</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black text-yellow-400">{latency}<span className="text-2xl text-gray-400 font-normal"> ms</span></p>
              <p className={`text-sm font-bold ${getStatus(latency).color}`}>
                {getStatus(latency).label} · Live
              </p>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" />
            Latency Trend (Next 40 Minutes)
          </h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine
                  y={50}
                  label={{ position: 'insideTopLeft', value: 'Congestion Threshold', fill: '#ef4444', fontSize: 12 }}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                />
                <Area type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Latency (ms)" connectNulls />
                <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted (ms)" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-400" />
            Forecast Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="pb-4 font-medium">Time</th>
                  <th className="pb-4 font-medium">Predicted Latency</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {[
                  { time: '+10 min', latency: Math.round(latency * 1.15), status: 'Normal', risk: 'LOW', riskColor: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
                  { time: '+20 min', latency: Math.round(latency * 1.6), status: 'Moderate', risk: 'MEDIUM', riskColor: 'text-amber-500', bgColor: 'bg-amber-500/10' },
                  { time: '+30 min', latency: Math.round(latency * 2.2), status: 'Warning', risk: 'HIGH', riskColor: 'text-red-500', bgColor: 'bg-red-500/10' },
                  { time: '+40 min', latency: Math.round(latency * 1.8), status: 'Moderate', risk: 'MEDIUM', riskColor: 'text-amber-500', bgColor: 'bg-amber-500/10' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 font-medium">{row.time}</td>
                    <td className="py-4 font-bold text-yellow-400">{row.latency} ms</td>
                    <td className={`py-4 font-bold ${row.riskColor}`}>{row.status}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.bgColor} ${row.riskColor}`}>
                        {row.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Latency;
