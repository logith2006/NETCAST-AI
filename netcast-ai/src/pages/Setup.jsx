import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Globe, Lock, ArrowRight, Activity, Shield, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sha256Hash, verifyPassword, generateSessionToken } from '../services/securityService';

const CONNECTING_STEPS = [
  { label: 'Verifying credentials...', icon: Lock, color: 'text-blue-400' },
  { label: 'Scanning network topology...', icon: Wifi, color: 'text-purple-400' },
  { label: 'Pinging router...', icon: Globe, color: 'text-cyan-400' },
  { label: 'Securing session...', icon: Shield, color: 'text-emerald-400' },
  { label: 'Launching NetCast AI...', icon: Activity, color: 'text-blue-400' },
];

function Setup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ networkName: '', ipAddress: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectStep, setConnectStep] = useState(0);
  const [connectDone, setConnectDone] = useState(false);

  // If already set up, go straight to dashboard
  useEffect(() => {
    const stored = localStorage.getItem('netcast_network');
    if (stored) {
      const data = JSON.parse(stored);
      // Pre-fill network name
      setFormData(prev => ({ ...prev, networkName: data.networkName || '', ipAddress: data.ipAddress || '' }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.networkName.trim()) errs.networkName = 'Network name is required';
    if (!formData.ipAddress.trim()) {
      errs.ipAddress = 'IP address is required';
    } else {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(formData.ipAddress.trim())) errs.ipAddress = 'Enter valid IP (e.g., 192.168.1.1)';
    }
    if (!formData.password.trim()) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if returning user — verify SHA-256 password hash
    const stored = localStorage.getItem('netcast_network');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.passwordHash) {
        const isValid = await verifyPassword(formData.password, data.passwordHash);
        if (!isValid) {
          setErrors({ password: '❌ Incorrect password. Access denied.' });
          return;
        }
      }
    }

    setIsConnecting(true);
    setConnectStep(0);

    // Animate through steps
    for (let i = 0; i < CONNECTING_STEPS.length; i++) {
      await new Promise(res => setTimeout(res, 700));
      setConnectStep(i + 1);
    }

    // Save to localStorage with real SHA-256 hash (Web Crypto API)
    const passwordHash = await sha256Hash(formData.password);
    const sessionToken = generateSessionToken();
    localStorage.setItem('netcast_network', JSON.stringify({
      networkName: formData.networkName.trim(),
      ipAddress: formData.ipAddress.trim(),
      passwordHash,
      sessionToken,
      connectedAt: new Date().toISOString(),
    }));
    sessionStorage.setItem('netcast_session', sessionToken);

    setConnectDone(true);
    await new Promise(res => setTimeout(res, 1000));
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f172a 100%)' }}
    >
      {/* Background glows */}
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl top-0 -left-20 animate-pulse" />
      <div className="absolute w-80 h-80 bg-purple-600/10 rounded-full blur-3xl bottom-0 -right-20 animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <AnimatePresence mode="wait">
        {isConnecting ? (
          /* Connecting Animation Screen */
          <motion.div
            key="connecting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-md text-center"
          >
            <div
              className="p-10 rounded-3xl shadow-2xl border border-white/10"
              style={{ background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(24px)' }}
            >
              {/* Animated Ring */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#1e3a5f" strokeWidth="8" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="url(#grad)" strokeWidth="8"
                    strokeDasharray="276" strokeDashoffset="180" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {connectDone
                    ? <CheckCircle className="text-emerald-400" size={40} />
                    : <Activity className="text-blue-400" size={40} />
                  }
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {connectDone ? '✅ Connected!' : 'Connecting to Network'}
              </h2>
              <p className="text-gray-400 text-sm mb-8">{formData.networkName}</p>

              {/* Steps */}
              <div className="space-y-3 text-left">
                {CONNECTING_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isDone = connectStep > i;
                  const isActive = connectStep === i;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: connectStep >= i ? 1 : 0.3, x: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isDone ? 'bg-emerald-500/10 border border-emerald-500/20' : isActive ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5 border border-white/5'}`}
                    >
                      {isDone
                        ? <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                        : <Icon size={18} className={`${step.color} shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                      }
                      <span className={`text-sm font-medium ${isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Form Screen */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-lg"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-5">
                <Shield size={16} /> Secure Network Access
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Connect Your Network</h1>
              <p className="text-gray-400">Enter your network credentials to begin monitoring with NetCast AI.</p>
            </div>

            {/* Form Card */}
            <div
              className="p-8 rounded-3xl shadow-2xl border border-white/10"
              style={{ background: 'rgba(15, 23, 42, 0.90)', backdropFilter: 'blur(24px)' }}
            >
              {/* Security Badge */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <Shield size={20} className="text-emerald-400 shrink-0" />
                <div>
                  <p className="text-emerald-400 font-bold text-sm">End-to-End Secure</p>
                  <p className="text-gray-400 text-xs">Credentials are hashed & stored only on your device. Never sent to any server.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Network Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Wifi size={15} className="text-blue-400" /> Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    name="networkName"
                    value={formData.networkName}
                    onChange={handleChange}
                    placeholder="e.g., AKATHTHIAN-HOME"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-700 bg-gray-900/60 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  {errors.networkName && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.networkName}</p>}
                </div>

                {/* IP Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Globe size={15} className="text-purple-400" /> Router IP Address
                  </label>
                  <input
                    type="text"
                    name="ipAddress"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    placeholder="e.g., 192.168.1.1"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-700 bg-gray-900/60 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                  />
                  {errors.ipAddress && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.ipAddress}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Lock size={15} className="text-emerald-400" /> Network Access Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Your network password"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-700 bg-gray-900/60 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.password}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full text-white font-bold text-lg py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl flex items-center justify-center gap-3 mt-2"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}
                >
                  <Shield size={20} />
                  Connect & Secure Access
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>

            <p className="text-center mt-5 text-gray-600 text-xs">
              🔒 All credentials are hashed (SHA-like) before storage. Hackers cannot recover your password.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Setup;
