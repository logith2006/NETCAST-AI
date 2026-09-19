import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Globe, Lock, ArrowRight, Activity, Server, Eye, EyeOff } from 'lucide-react';

function Setup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    networkName: 'logith',
    ipAddress: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.networkName.trim()) newErrors.networkName = 'Network name is required';
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = 'IP address is required';
    } else {
      // Basic IP format validation (IPv4)
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(formData.ipAddress.trim())) {
        newErrors.ipAddress = 'Enter a valid IP address (e.g., 192.168.1.1)';
      }
    }
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsConnecting(true);

    const networkData = {
      networkName: formData.networkName.trim(),
      ipAddress: formData.ipAddress.trim(),
    };

    try {
      // Send data to backend
      const response = await fetch('http://localhost:8080/api/network/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(networkData)
      });

      if (!response.ok) {
        throw new Error('Failed to register network');
      }

      // Store locally for Dashboard reference
      localStorage.setItem('netcast_network', JSON.stringify({
        ...networkData,
        connectedAt: new Date().toISOString(),
      }));

      // Simulate connection delay for premium feel
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      setErrors({ ipAddress: 'Backend server is offline. Please start the Node.js server.' });
      setIsConnecting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      {/* Background decorations */}
      <div className="absolute w-96 h-96 bg-blue-500/8 rounded-full blur-3xl top-10 -left-20 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-purple-500/8 rounded-full blur-3xl bottom-10 -right-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.7s' }}></div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-5">
            <Server size={16} />
            Network Configuration
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Connect Your Network
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Enter your router or network details below to start monitoring with NetCast AI.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="p-8 rounded-2xl shadow-2xl border border-white/10"
          style={{ background: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(20px)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Network Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Wifi size={16} className="text-blue-400" />
                Network Name (SSID)
              </label>
              <input
                type="text"
                name="networkName"
                value={formData.networkName}
                onChange={handleChange}
                placeholder="e.g., MyHomeWiFi"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
              {errors.networkName && (
                <p className="text-red-400 text-xs mt-1.5">{errors.networkName}</p>
              )}
            </div>

            {/* IP Address Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Globe size={16} className="text-purple-400" />
                Router IP Address
              </label>
              <input
                type="text"
                name="ipAddress"
                value={formData.ipAddress}
                onChange={handleChange}
                placeholder="e.g., 192.168.1.1"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
              {errors.ipAddress && (
                <p className="text-red-400 text-xs mt-1.5">{errors.ipAddress}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Lock size={16} className="text-emerald-400" />
                Network Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your network password"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connecting to Network...
                </>
              ) : (
                <>
                  <Activity size={22} />
                  Connect & Start Monitoring
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Info Note */}
          <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-gray-400 text-xs text-center leading-relaxed">
              🔒 Your network credentials are stored locally on your device and are never sent to external servers.
              NetCast AI uses your IP to ping and measure latency in real-time.
            </p>
          </div>
        </div>

        {/* Skip Link */}
        <p className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors underline underline-offset-4"
          >
            Skip setup and go to Dashboard →
          </button>
        </p>
      </div>
    </div>
  );
}

export default Setup;
