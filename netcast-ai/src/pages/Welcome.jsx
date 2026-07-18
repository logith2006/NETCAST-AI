import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Shield, Eye, Target, Zap, ArrowRight, Globe, CheckCircle, 
  Server, Cpu, Code, Database, Star, Home, Building2, Radio, GraduationCap, 
  ChevronRight, Network
} from 'lucide-react';

// Custom Mouse Glow Hook
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  useEffect(() => {
    const updateMousePosition = ev => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

// 1. Loading Screen Component
const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Checking Network...');

  useEffect(() => {
    const timer1 = setTimeout(() => { setProgress(40); setText('Loading AI Models...'); }, 1000);
    const timer2 = setTimeout(() => { setProgress(80); setText('Calibrating Forecast...'); }, 2000);
    const timer3 = setTimeout(() => { setProgress(100); setText('Forecast Ready.'); }, 2800);
    const timer4 = setTimeout(onComplete, 3500);

    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-white"
    >
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-8"
      >
        <Activity size={64} className="text-blue-500" />
      </motion.div>
      <h1 className="text-3xl font-bold mb-8 tracking-wider">NetCast AI</h1>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
        <motion.div 
          className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-gray-400 font-mono text-sm h-6">{text}</p>
    </motion.div>
  );
};

export default function Welcome() {
  const navigate = useNavigate();
  const mousePosition = useMousePosition();

  // Scroll Animations Config
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-white overflow-x-hidden selection:bg-blue-500/30">


      {/* Mouse Follower Glow */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        
        {/* Floating Particles/Glows */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]" />
        <motion.div animate={{ y: [0, 30, 0], x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />

        {/* Network Node Animation SVG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[600px] opacity-10 pointer-events-none z-0">
          <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_60s_linear_infinite]">
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="5 5" />
            <circle cx="200" cy="50" r="8" fill="currentColor" className="animate-pulse" />
            <circle cx="350" cy="200" r="8" fill="currentColor" className="animate-pulse" />
            <circle cx="200" cy="350" r="8" fill="currentColor" className="animate-pulse" />
            <circle cx="50" cy="200" r="8" fill="currentColor" className="animate-pulse" />
            <line x1="200" y1="50" x2="200" y2="200" stroke="currentColor" strokeWidth="2" />
            <line x1="350" y1="200" x2="200" y2="200" stroke="currentColor" strokeWidth="2" />
            <line x1="200" y1="350" x2="200" y2="200" stroke="currentColor" strokeWidth="2" />
            <line x1="50" y1="200" x2="200" y2="200" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide">NetCast AI Engine v1.0 Live</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
            Network Forecast.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
              AI Powered.
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Predict network congestion, latency spikes, and downtime before they happen. The weather forecast for your internet.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] transition-all hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <div className="relative flex items-center gap-3">
                Open Dashboard <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
            <button className="px-8 py-4 rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/5 transition-all text-gray-300 hover:text-white">
              View Documentation
            </button>
          </motion.div>

          {/* Hero Statistics */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 border-t border-white/5 pt-12">
            <div>
              <h3 className="text-4xl font-bold text-white mb-2 shadow-blue-500/50 drop-shadow-lg">10K+</h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Predictions Made</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-2 shadow-purple-500/50 drop-shadow-lg">99.2%</h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">AI Accuracy</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-2 shadow-blue-500/50 drop-shadow-lg">24/7</h3>
              <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Real-time Monitoring</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp} className="group p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Eye className="text-blue-400" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <ul className="space-y-4 text-gray-400 mb-8">
                <li className="flex items-center gap-3"><CheckCircle className="text-blue-500 shrink-0" size={20}/> Predict failures before they happen</li>
                <li className="flex items-center gap-3"><CheckCircle className="text-blue-500 shrink-0" size={20}/> Reduce global internet downtime</li>
                <li className="flex items-center gap-3"><CheckCircle className="text-blue-500 shrink-0" size={20}/> Democratize AI network insights</li>
              </ul>
              <a href="#" className="inline-flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-4 transition-all">
                Learn More <ChevronRight size={18}/>
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="group p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.1)]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent flex items-center justify-center mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Target className="text-purple-400" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                To empower network administrators and everyday users with machine learning tools that instantly detect congestion and intelligently route resources to maintain peak performance.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-4 transition-all">
                Read Whitepaper <ChevronRight size={18}/>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-16">How AI Forecasts Congestion</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            {/* Step 1 */}
            <div className="flex-1 w-full text-center p-6 border border-white/5 rounded-2xl bg-black/20">
              <p className="text-gray-400 text-sm uppercase font-bold mb-2">Current State</p>
              <div className="text-3xl font-bold text-white mb-2">85 Mbps</div>
              <p className="text-emerald-500 text-sm flex items-center justify-center gap-1"><Zap size={14}/> Stable</p>
            </div>
            
            <ArrowRight className="hidden md:block text-gray-600 animate-pulse" size={32} />
            <ArrowRight className="md:hidden text-gray-600 animate-pulse rotate-90" size={32} />

            {/* Step 2 */}
            <div className="flex-1 w-full text-center p-6 border border-blue-500/30 rounded-2xl bg-blue-500/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
              <p className="text-blue-400 text-sm uppercase font-bold mb-2 relative z-10">AI Prediction (+30m)</p>
              <div className="text-3xl font-bold text-white mb-2 relative z-10">62 Mbps</div>
              <p className="text-amber-500 text-sm flex items-center justify-center gap-1 relative z-10"><Activity size={14}/> Degradation Expected</p>
            </div>

            <ArrowRight className="hidden md:block text-gray-600 animate-pulse" size={32} />
            <ArrowRight className="md:hidden text-gray-600 animate-pulse rotate-90" size={32} />

            {/* Step 3 */}
            <div className="flex-1 w-full text-center p-6 border border-emerald-500/30 rounded-2xl bg-emerald-500/5">
              <p className="text-emerald-400 text-sm uppercase font-bold mb-2">Action Taken</p>
              <div className="text-lg font-bold text-white mb-2 px-4 py-2 bg-emerald-500/20 rounded-lg">Alert Admin</div>
              <p className="text-gray-400 text-xs mt-3">Prevented downtime</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* AI Prediction Example Progress Bars */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Risk Analysis</h2>
            <p className="text-gray-400">Our models calculate risk dynamically based on device load.</p>
          </motion.div>

          <div className="space-y-8 bg-white/[0.02] border border-white/5 p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
            {/* Low Risk */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-lg">10 Devices</span>
                <span className="text-emerald-500 font-semibold text-sm">Low Risk</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden flex">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '33%' }} transition={{ duration: 1 }} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              </div>
            </div>
            
            {/* Moderate Risk */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-lg">24 Devices</span>
                <span className="text-amber-500 font-semibold text-sm">Moderate Risk</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden flex">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
              </div>
            </div>

            {/* Critical Risk */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-lg text-red-400">30+ Devices</span>
                <span className="text-red-500 font-semibold text-sm animate-pulse">Critical Congestion</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden flex">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-red-500 shadow-[0_0_15px_#ef4444]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses NetCast */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-16">
            Trusted by Thousands
          </motion.h2>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Home, title: "Smart Homes", desc: "Monitor family Wi-Fi" },
              { icon: Building2, title: "Offices", desc: "Prevent meeting drops" },
              { icon: Radio, title: "ISPs", desc: "Manage node traffic" },
              { icon: GraduationCap, title: "Colleges", desc: "Campus connectivity" }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="group p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer">
                <item.icon className="mx-auto mb-4 text-gray-500 group-hover:text-blue-400 group-hover:-translate-y-2 group-hover:scale-110 transition-all" size={40} />
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Fake Testimonials (Hackathon Demo) */}
      <section className="py-24 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="text-yellow-500 fill-yellow-500" size={24}/>)}
          </div>
          <p className="text-2xl md:text-3xl font-light italic text-gray-300 mb-8 leading-relaxed">
            "NetCast AI predicted a severe congestion event 20 minutes before our company-wide All-Hands meeting. We disconnected idle devices and had zero packet loss during the call. It's like magic."
          </p>
          <div>
            <h4 className="font-bold text-white text-lg">Alex Mercer</h4>
            <p className="text-blue-400">Senior Network Administrator</p>
          </div>
        </motion.div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-6 border-y border-white/5 bg-black/30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-8">Powered by Industry Standards</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="flex items-center gap-2 font-bold text-xl"><Code size={24}/> React</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Server size={24}/> Node.js</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Cpu size={24}/> TensorFlow</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Database size={24}/> MongoDB</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Network size={24}/> Express</div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-[#0a0f18] pt-20 pb-10 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-blue-500" size={28} />
              <span className="text-2xl font-bold text-white">NetCast AI</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Predictive network monitoring powered by artificial intelligence.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">AI Engine</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Pricing (Demo)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Developers</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">GitHub Repo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 NetCast AI Inc. All rights reserved.</p>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse">❤️</span> using React, Node & AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
