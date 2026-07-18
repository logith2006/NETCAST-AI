import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Eye, Target, Wifi, Users, Zap, ArrowRight, Globe } from 'lucide-react';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)',
        }}
      >
        {/* Animated Background Glow */}
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-1/2 -translate-x-1/2 animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl bottom-20 right-20 animate-pulse"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-blue-500/20">
              <Activity className="text-blue-400" size={48} />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            NetCast <span className="text-blue-400">AI</span>
          </h1>
          <p className="text-xl text-gray-300 mb-2 font-medium">
            AI-Powered Network Weather Forecasting
          </p>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Predict network congestion, latency spikes, and connection drops before they happen.
            Stay one step ahead with intelligent network monitoring.
          </p>
          <button
            onClick={() => navigate('/purpose')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 px-10 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25 flex items-center gap-3 mx-auto"
          >
            Get Started
            <ArrowRight size={22} />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 text-gray-500 text-sm animate-bounce">
          Scroll down to learn more ↓
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Vision & Mission
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div
            className="p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
            style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}
          >
            <div className="p-3 rounded-xl bg-blue-500/20 w-fit mb-5">
              <Eye className="text-blue-400" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              To create a world where network outages and slowdowns are predicted and prevented
              before they affect users. Just like weather forecasting changed how we plan our days,
              NetCast AI aims to revolutionize how organizations manage their network infrastructure.
            </p>
          </div>

          {/* Mission Card */}
          <div
            className="p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300"
            style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)' }}
          >
            <div className="p-3 rounded-xl bg-purple-500/20 w-fit mb-5">
              <Target className="text-purple-400" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">
              To empower network administrators and users with AI-driven insights that predict
              congestion, identify performance bottlenecks, and provide actionable alerts — enabling
              proactive network management instead of reactive troubleshooting.
            </p>
          </div>
        </div>
      </section>

      {/* Why NetCast AI Section */}
      <section className="py-24 px-8" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why NetCast AI?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Traditional network monitoring only tells you what happened.
              NetCast AI tells you what is going to happen.
            </p>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="p-4 rounded-2xl bg-green-500/10 w-fit mx-auto mb-5">
                <Zap className="text-green-400" size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Real-Time Speed Tracking</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connect your network IP and instantly see your real-time latency,
                download speed, and connection quality updated every 3 seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="p-4 rounded-2xl bg-yellow-500/10 w-fit mx-auto mb-5">
                <Users className="text-yellow-400" size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Connected Device Count</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                See exactly how many devices are connected to your network
                at any given time, and track connection history over the day.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="p-4 rounded-2xl bg-red-500/10 w-fit mx-auto mb-5">
                <Shield className="text-red-400" size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Smart AI Alerts</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get intelligent warnings before your network slows down.
                NetCast AI predicts congestion 30 minutes ahead so you can take action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div
            className="p-8 rounded-2xl border border-white/10 relative"
            style={{ background: 'rgba(30, 41, 59, 0.5)' }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              1
            </div>
            <Globe className="text-blue-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Connect Your Network</h4>
            <p className="text-gray-400 text-sm">
              Login and your IP address is automatically detected. The system starts monitoring your network instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className="p-8 rounded-2xl border border-white/10 relative"
            style={{ background: 'rgba(30, 41, 59, 0.5)' }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              2
            </div>
            <Activity className="text-purple-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">AI Analyzes Your Traffic</h4>
            <p className="text-gray-400 text-sm">
              Our Machine Learning model analyzes your network patterns and predicts future performance.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className="p-8 rounded-2xl border border-white/10 relative"
            style={{ background: 'rgba(30, 41, 59, 0.5)' }}
          >
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              3
            </div>
            <Shield className="text-green-400 mb-4" size={28} />
            <h4 className="text-lg font-bold text-white mb-2">Get Smart Alerts</h4>
            <p className="text-gray-400 text-sm">
              Receive alerts before congestion occurs. Take preventive action and maintain smooth network performance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 text-center" style={{ background: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.1))' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to forecast your network?
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Join NetCast AI and never be surprised by network downtime again.
        </p>
        <button
          onClick={() => navigate('/purpose')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 px-12 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25 flex items-center gap-3 mx-auto"
        >
          Open Dashboard
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

export default Welcome;
