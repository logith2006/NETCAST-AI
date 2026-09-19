import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Users, Wifi, Zap, Brain, Shield, Globe, ArrowRight,
  Monitor, Server, BarChart3, AlertCircle, CheckCircle, Cpu
} from 'lucide-react';

function Purpose() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Wifi className="text-blue-400" size={28} />,
      title: 'Real-Time Network Monitoring',
      desc: 'Connect your network IP and instantly monitor download speed, latency, and connection quality — updated every 3 seconds.',
      color: 'blue',
    },
    {
      icon: <Users className="text-purple-400" size={28} />,
      title: 'Connected Device Tracking',
      desc: 'See exactly how many devices are connected to your router. Track connection history and detect unauthorized access.',
      color: 'purple',
    },
    {
      icon: <Brain className="text-emerald-400" size={28} />,
      title: 'AI Congestion Prediction',
      desc: 'Our AI analyzes patterns: if 30+ devices connect, speed drops. If too many connect, packet collisions happen. Get alerts before it occurs.',
      color: 'emerald',
    },
    {
      icon: <BarChart3 className="text-amber-400" size={28} />,
      title: 'Speed Classification',
      desc: 'Network speed is classified as Fast, Slow, or No Connection in real-time. Historical data helps predict future patterns.',
      color: 'amber',
    },
  ];

  const userTypes = [
    { icon: <Monitor size={24} />, label: 'Home Users', desc: 'Monitor your WiFi speed and know when your router is overloaded.' },
    { icon: <Server size={24} />, label: 'Network Admins', desc: 'Track all connected devices, manage bandwidth, and prevent congestion.' },
    { icon: <Cpu size={24} />, label: 'IT Teams', desc: 'Get AI-powered alerts before network slowdowns impact productivity.' },
    { icon: <Globe size={24} />, label: 'Small Businesses', desc: 'Ensure smooth internet for your office with proactive monitoring.' },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section
        className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a1145 40%, #0f172a 100%)' }}
      >
        {/* Animated Glows */}
        <div className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl top-10 left-1/4 animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl bottom-10 right-1/4 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
            <Brain size={16} />
            AI-Powered Network Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Why We Built <span className="text-blue-400">NetCast AI</span>
          </h1>
          <p className="text-lg text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto">
            Traditional network monitoring only tells you <strong className="text-white">what happened</strong>.
            NetCast AI tells you <strong className="text-blue-400">what is going to happen</strong>.
          </p>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            When too many devices connect to a router, speed drops and packet collisions occur.
            Our AI predicts these problems <em>before</em> they happen — so you can take action.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-8" style={{ background: 'rgba(15, 23, 42, 0.9)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The Problem We Solve</h2>
            <div className="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="p-6 rounded-2xl border border-red-500/20 text-center"
              style={{ background: 'rgba(239, 68, 68, 0.05)' }}
            >
              <div className="text-4xl mb-3">🐌</div>
              <h4 className="text-lg font-bold text-white mb-2">Slow Speed</h4>
              <p className="text-gray-400 text-sm">
                10+ devices on a router? Speed starts dropping. 30+ devices? It becomes unusable.
                You don't know until it's too late.
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border border-amber-500/20 text-center"
              style={{ background: 'rgba(245, 158, 11, 0.05)' }}
            >
              <div className="text-4xl mb-3">💥</div>
              <h4 className="text-lg font-bold text-white mb-2">Packet Collisions</h4>
              <p className="text-gray-400 text-sm">
                When too many devices transmit data simultaneously, packets collide and get lost.
                This causes lag, disconnections, and retransmissions.
              </p>
            </div>

            <div
              className="p-6 rounded-2xl border border-gray-500/20 text-center"
              style={{ background: 'rgba(100, 116, 139, 0.05)' }}
            >
              <div className="text-4xl mb-3">❓</div>
              <h4 className="text-lg font-bold text-white mb-2">No Visibility</h4>
              <p className="text-gray-400 text-sm">
                Most users have zero idea how many devices are connected or why their internet is slow.
                NetCast AI gives you full visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What NetCast AI Does */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What NetCast AI Does</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Connect your network and let our AI do the heavy lifting.
          </p>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
              style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}
            >
              <div className={`p-3 rounded-xl bg-${f.color}-500/20 w-fit mb-5 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Prediction Explanation */}
      <section className="py-20 px-8" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8), rgba(30, 27, 75, 0.4))' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How AI Prediction Works</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            {/* Prediction Step 1 */}
            <div
              className="flex gap-5 items-start p-6 rounded-2xl border border-white/10"
              style={{ background: 'rgba(30, 41, 59, 0.5)' }}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                1
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Monitor Devices & Speed</h4>
                <p className="text-gray-400 text-sm">
                  NetCast AI continuously tracks how many devices are connected and measures real-time download/upload speed and latency (ping).
                </p>
              </div>
            </div>

            {/* Prediction Step 2 */}
            <div
              className="flex gap-5 items-start p-6 rounded-2xl border border-white/10"
              style={{ background: 'rgba(30, 41, 59, 0.5)' }}
            >
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                2
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">AI Analyzes Patterns</h4>
                <p className="text-gray-400 text-sm">
                  The AI model learns from traffic patterns. For example: "Every day at 7 PM, 25 devices connect and speed drops by 60%."
                  It builds a prediction model from this data.
                </p>
              </div>
            </div>

            {/* Prediction Step 3 */}
            <div
              className="flex gap-5 items-start p-6 rounded-2xl border border-white/10"
              style={{ background: 'rgba(30, 41, 59, 0.5)' }}
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                3
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Predict & Alert</h4>
                <p className="text-gray-400 text-sm">
                  <strong className="text-emerald-400">Example:</strong> "If 30 devices connect, expect 70% speed reduction in 15 minutes.
                  If more than 40 connect, packet collisions will start. Disconnect 10 devices to maintain performance."
                </p>
              </div>
            </div>
          </div>

          {/* Quick AI Example Box */}
          <div
            className="mt-10 p-6 rounded-2xl border border-emerald-500/30"
            style={{ background: 'rgba(16, 185, 129, 0.08)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-emerald-400" size={24} />
              <h4 className="text-lg font-bold text-white">AI Prediction Example</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-emerald-500/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="text-emerald-400" size={18} />
                  <span className="text-emerald-400 font-bold text-sm">10 Devices</span>
                </div>
                <p className="text-gray-300 text-xs">Speed: Fast (85 Mbps)</p>
                <p className="text-gray-400 text-xs">No issues predicted</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="text-amber-400" size={18} />
                  <span className="text-amber-400 font-bold text-sm">30 Devices</span>
                </div>
                <p className="text-gray-300 text-xs">Speed: Slow (22 Mbps)</p>
                <p className="text-gray-400 text-xs">Congestion risk: HIGH</p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="text-red-400" size={18} />
                  <span className="text-red-400 font-bold text-sm">50+ Devices</span>
                </div>
                <p className="text-gray-300 text-xs">Speed: Critical (3 Mbps)</p>
                <p className="text-gray-400 text-xs">Packet collisions detected!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses NetCast AI */}
      <section className="py-20 px-8 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Who Uses NetCast AI?</h2>
          <div className="w-20 h-1 bg-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {userTypes.map((u, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 text-center hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(30, 41, 59, 0.5)' }}
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center mx-auto mb-4 text-purple-400">
                {u.icon}
              </div>
              <h4 className="text-white font-bold mb-2">{u.label}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-8 text-center"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.1))' }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Connect Your Network?
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Enter your network details and let NetCast AI start monitoring and predicting.
        </p>
        <button
          onClick={() => navigate('/setup')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 px-12 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25 inline-flex items-center gap-3"
        >
          Connect My Network
          <ArrowRight size={22} />
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm">
          © 2026 NetCast AI. Built with React, Node.js & Firebase.
        </p>
      </footer>
    </div>
  );
}

export default Purpose;
