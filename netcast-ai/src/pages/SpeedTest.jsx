import React, { useState, useEffect } from 'react';
import { Play, ArrowDown, ArrowUp, Activity, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const SpeedTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [testPhase, setTestPhase] = useState('idle'); // idle, ping, download, upload, complete
  
  const [results, setResults] = useState({
    ping: 0,
    download: 0,
    upload: 0
  });

  const startTest = () => {
    setIsTesting(true);
    setProgress(0);
    setSpeed(0);
    setTestPhase('ping');
    setResults({ ping: 0, download: 0, upload: 0 });

    // Mock testing sequence for UI demonstration
    
    // Ping Phase (0-20%)
    setTimeout(() => {
      setResults(r => ({ ...r, ping: 12 }));
      setTestPhase('download');
      
      // Download Phase (20-60%)
      let dProgress = 20;
      const dInterval = setInterval(() => {
        dProgress += 2;
        setProgress(dProgress);
        setSpeed(Math.floor(Math.random() * 20) + 70); // Mock 70-90 Mbps
        
        if (dProgress >= 60) {
          clearInterval(dInterval);
          setResults(r => ({ ...r, download: 85.4 }));
          setTestPhase('upload');
          
          // Upload Phase (60-100%)
          let uProgress = 60;
          const uInterval = setInterval(() => {
            uProgress += 2;
            setProgress(uProgress);
            setSpeed(Math.floor(Math.random() * 10) + 30); // Mock 30-40 Mbps
            
            if (uProgress >= 100) {
              clearInterval(uInterval);
              setResults(r => ({ ...r, upload: 36.2 }));
              setTestPhase('complete');
              setIsTesting(false);
              setSpeed(0);
            }
          }, 100);
        }
      }, 100);
    }, 1500);
  };

  // SVG Circle calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="p-6 md:p-10 min-h-[calc(100vh-64px)] flex flex-col">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-center mb-8">Speed Test</h1>

      {/* Main Gauge Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative mb-12">
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90 absolute">
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-700"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="144"
              cy="144"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.2 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="text-center z-10">
            {testPhase === 'idle' || testPhase === 'complete' ? (
              <button 
                onClick={startTest}
                disabled={isTesting}
                className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
              >
                {testPhase === 'complete' ? <RotateCcw className="w-10 h-10 text-white" /> : <Play className="w-12 h-12 text-white ml-2" />}
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-1">{testPhase}</span>
                <span className="text-5xl font-bold text-white">{speed}</span>
                <span className="text-sm font-medium text-slate-400">Mbps</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto w-full">
        <div className={`glass-card p-4 flex flex-col items-center text-center transition-opacity ${testPhase === 'idle' ? 'opacity-40' : 'opacity-100'}`}>
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mb-2">
            <ArrowDown className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Download</span>
          <span className="text-lg font-bold text-white">{results.download ? results.download : '--'}</span>
        </div>

        <div className={`glass-card p-4 flex flex-col items-center text-center transition-opacity ${testPhase === 'upload' || testPhase === 'complete' ? 'opacity-100' : 'opacity-40'}`}>
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/20 flex items-center justify-center mb-2">
            <ArrowUp className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Upload</span>
          <span className="text-lg font-bold text-white">{results.upload ? results.upload : '--'}</span>
        </div>

        <div className={`glass-card p-4 flex flex-col items-center text-center transition-opacity ${testPhase !== 'idle' ? 'opacity-100' : 'opacity-40'}`}>
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/20 flex items-center justify-center mb-2">
            <Activity className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ping</span>
          <span className="text-lg font-bold text-white">{results.ping ? `${results.ping} ms` : '--'}</span>
        </div>
      </div>
    </div>
  );
};

export default SpeedTest;
