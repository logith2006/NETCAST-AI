import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, FileText, Shield, Activity, Wifi, CloudRain,
  Cpu, Network, Server, Lock, Zap, Users, Brain, ChevronDown,
  ChevronRight, Globe, BookOpen, Code, Award
} from 'lucide-react';

const sections = [
  {
    id: 'abstract',
    icon: BookOpen,
    color: '#a78bfa',
    title: 'Abstract / Overview',
    content: [
      'NetCast AI is an Enterprise-Grade, AI-powered Network Operations Center (NOC) web platform designed to predict, monitor, and manage telecom and local network infrastructure in real time.',
      'The system integrates real-time weather data (Open-Meteo API), ITU-R P.838 Rain Attenuation modeling, Deep Packet Inspection (DPI), SHA-256 security, and OSI Layer 3/4 traffic analysis into a single unified dashboard.',
      'It is built on a MERN-adjacent stack (React + Vite + Firebase) with offline-first architecture, ensuring functionality even without a backend connection.',
    ],
  },
  {
    id: 'problem',
    icon: Zap,
    color: '#f97316',
    title: 'Problem Statement',
    content: [
      'Traditional network monitoring tools are reactive — they alert only after a failure occurs, causing service disruption, user dissatisfaction, and financial loss for telecom operators.',
      'Heavy rainfall causes Rain Fade (signal attenuation on high-frequency bands like 5G/WiFi at 28 GHz and 5 GHz), drastically reducing bandwidth. No consumer-grade tool addresses this proactively.',
      'Network congestion from too many connected devices operating simultaneously results in packet loss, high latency, jitter, and call drops — all of which can be predicted and mitigated before they occur.',
      'Existing tools lack integration between weather intelligence, device management, and real-time KPI monitoring in a single accessible web platform.',
    ],
  },
  {
    id: 'solution',
    icon: Brain,
    color: '#22c55e',
    title: 'Proposed Solution',
    content: [
      'NetCast AI addresses all the above problems through a unified AI-powered dashboard that combines weather intelligence, network KPI tracking, device management, and security into a single platform.',
      'The AI Prediction Engine analyses connected device count, latency, and packet drop rate to predict network health and classify it per ITU-T Y.1541 QoS standards (Excellent / Good / Fair / Poor / Critical).',
      'The Rain Attenuation Engine uses real-time precipitation data from Open-Meteo API and applies the ITU-R P.838 mathematical model to calculate signal degradation in dB/km — sending automatic warnings before congestion occurs.',
      'The Deep Packet Inspection (DPI) module simulates Wireshark-style L3/L4 traffic logging, tracking TCP handshakes, UDP flows, ICMP packets, and packet retransmissions in real time.',
    ],
  },
  {
    id: 'architecture',
    icon: Server,
    color: '#38bdf8',
    title: 'System Architecture',
    content: [
      'Frontend: React 18 + Vite (SPA) with TailwindCSS for glassmorphism UI, Framer Motion for micro-animations, and Recharts for real-time data visualization.',
      'Backend: Firebase Authentication for user identity management. All network configuration data is stored client-side using Browser localStorage with SHA-256 hashed credentials.',
      'Weather Intelligence Layer: Open-Meteo API (free, no API key) provides real-time precipitation, wind speed, humidity, and WMO weather codes at 15-minute intervals.',
      'Network KPI Engine: HTTP-based RTT measurement proxying ICMP ping behavior (browser constraint), with Packet Drop Rate, Jitter (RFC 3550 formula), and Uptime tracking.',
      'Security Layer: Web Crypto API (browser built-in) for SHA-256 password hashing. Session tokens are generated using crypto.getRandomValues() — no plain-text credentials stored anywhere.',
      'Routing: React Router v6 with protected routes. All pages require Firebase Auth state. Navigation flow: Login → Welcome → Network Setup → Dashboard.',
    ],
  },
  {
    id: 'features',
    icon: Activity,
    color: '#eab308',
    title: 'Key Features & Modules',
    content: [
      '🌐 Dashboard: Central hub showing Download/Upload speed, Latency sparkline, Connected Devices gauge, AI Network Health score (with circular gauge), Weather widget, App Data Usage bars (Netflix, YouTube, Instagram, etc.), and Packet Loss/Jitter KPIs.',
      '🌧️ Rain Attenuation Engine: Uses ITU-R P.838 standard — γR = k × R^α (dB/km) — to calculate signal degradation based on real precipitation rate. Supports 4G (1.8 GHz), 5G (28 GHz), and WiFi (5 GHz) frequency profiles.',
      '📊 Latency Analysis Page (/latency): Full RTT history chart, AI latency forecast, Jitter trend graph, and network congestion prediction with Recharts AreaChart visualization.',
      '👥 Connected Devices Page (/devices): Lists all connected devices with vendor icons (Samsung, Laptop, Smart TV, etc.), IP addresses, connection type, signal strength, and per-device data usage.',
      '⚡ Speed Test Page (/speedtest): Animated real-time Download and Upload speed measurement with historical comparison charts.',
      '🔬 DPI & OSI Diagnostics Page (/diagnostics): Wireshark-style packet log showing Time, Source IP:Port, Destination IP:Port, Protocol (TCP/UDP/ICMP), and Info (SYN, ACK, FIN, RST flags, retransmissions). TCP/UDP/Dropped counters shown live.',
      '🔐 Secure Network Setup Page (/setup): Users enter Network Name, IP Address, and Password. Password is SHA-256 hashed via Web Crypto API before local storage. Session tokens generated per login. Wrong password = Access Denied.',
    ],
  },
  {
    id: 'technical',
    icon: Code,
    color: '#f472b6',
    title: 'Technical Specifications',
    content: [
      'Rain Attenuation Formula (ITU-R P.838): γR = k × R^α where k and α are frequency-dependent empirical coefficients, R is rainfall rate in mm/hr. For WiFi (5 GHz): k=0.0751, α=1.099. For 5G (28 GHz): k=0.187, α=1.021.',
      'Jitter Calculation (RFC 3550): J(i) = J(i-1) + (|D(i-1,i)| - J(i-1)) / 16, where D(i-1,i) is the absolute difference between consecutive RTT values. This is the same formula used in VoIP RTP streams.',
      'ITU-T Y.1541 QoS Classification: Excellent (RTT < 100ms, Jitter < 50ms, Drop < 0.1%), Good (RTT < 200ms), Fair (RTT < 400ms), Poor (RTT < 1000ms), Critical (beyond thresholds).',
      'SHA-256 Hashing: Web Crypto API → crypto.subtle.digest("SHA-256", encoded) — produces a 256-bit (64 hex char) deterministic hash. Irreversible. Same password always produces same hash for verification.',
      'TCP 3-Way Handshake (DPI Layer): Step 1 - Client sends SYN (Synchronize). Step 2 - Server responds SYN-ACK. Step 3 - Client confirms ACK. Connection established. Tracked at OSI Layer 4 (Transport).',
      'OSI Layer Coverage: Layer 3 (Network) — IP routing, ICMP ping, packet loss. Layer 4 (Transport) — TCP/UDP session management, port tracking, window size analysis.',
    ],
  },
  {
    id: 'security',
    icon: Shield,
    color: '#22d3ee',
    title: 'Security Design',
    content: [
      'All credentials (Network Name, IP, Password) are stored exclusively in Browser localStorage — no data is ever transmitted to an external server.',
      'Passwords are hashed using SHA-256 via the Web Crypto API before storage. The original password is never saved anywhere — only its hash.',
      'Each login session generates a unique cryptographic session token using crypto.getRandomValues() stored in sessionStorage (cleared on browser close).',
      'The local IP address (192.168.x.x) used for network setup is a Private IP (RFC 1918) — it is not routable on the public internet, making it inaccessible to external hackers by design.',
      'Firebase Authentication handles user identity. Email/Password authentication with Google OAuth fallback ensures verified access before any network data is displayed.',
    ],
  },
  {
    id: 'scalability',
    icon: Globe,
    color: '#a3e635',
    title: 'Scalability & Future Scope',
    content: [
      'Current Phase: Micro-level deployment — functional on local subnet (192.168.x.x range), supporting up to 30 simultaneous devices per router.',
      'Phase 2 — ISP-Level Scale: Replace single-threaded HTTP polling with Asynchronous Architecture using WebSockets for real-time bidirectional KPI streaming to thousands of clients.',
      'Phase 3 — Telecom NOC Scale: Integrate Message Broker (Apache Kafka) to handle millions of SNMP traps, Syslog streams, and telemetry data from lakhs of network devices in parallel.',
      'Phase 4 — AI/ML Enhancement: Train a regression model on historical RTT + weather + device count data to predict congestion windows 30 minutes in advance — enabling proactive SLA management.',
      'Phase 5 — 5G NR Integration: Add 5G New Radio (NR) mmWave attenuation modeling, gNodeB signal monitoring, and beamforming disruption alerts during heavy precipitation.',
    ],
  },
  {
    id: 'tech_stack',
    icon: Cpu,
    color: '#fb923c',
    title: 'Technology Stack',
    content: [
      'Frontend Framework: React 18 with Vite bundler (HMR enabled) — SPA architecture with React Router v6 for client-side routing.',
      'Styling: TailwindCSS with custom glassmorphism utilities, CSS custom properties for theming, and Framer Motion for declarative animations.',
      'Charts & Visualization: Recharts library — AreaChart, LineChart, BarChart with real-time data binding and Recharts ResponsiveContainer.',
      'Authentication: Firebase Authentication (Google) with persistent auth state via onAuthStateChanged listener.',
      'Weather API: Open-Meteo (free tier, no API key) — provides WMO weather codes, precipitation rate, temperature, humidity, and wind speed.',
      'Security: Web Crypto API (browser built-in SHA-256), crypto.getRandomValues() for session tokens.',
      'Deployment: Vercel (CI/CD from GitHub) with SPA fallback routing. Netlify Drag-and-Drop as alternative deployment method.',
    ],
  },
  {
    id: 'team',
    icon: Award,
    color: '#c084fc',
    title: 'Author & Credits',
    content: [
      'Project Name: NetCast AI — Predictive Network Operations Center Platform',
      'Developer: Logith — Final Year Engineering Student, specializing in Telecom Network Monitoring and AI-driven infrastructure management.',
      'Project Type: Full-Stack Web Application (Open Source)',
      'Standards Compliance: ITU-R P.838 (Rain Attenuation), ITU-T Y.1541 (Network QoS), RFC 3550 (Jitter), RFC 1918 (Private IP), OSI 7-Layer Model, TCP/IP Protocol Suite.',
      'License: Proprietary — All rights reserved. Patent documentation pending.',
    ],
  },
];

const SectionCard = ({ section }) => {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-700/30 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: section.color + '20', border: '1px solid ' + section.color + '40' }}
          >
            <Icon size={20} style={{ color: section.color }} />
          </div>
          <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors text-left">
            {section.title}
          </h2>
        </div>
        <div style={{ color: section.color }}>
          {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-700/50 pt-4 space-y-3">
              {section.content.map((point, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: section.color }}
                  />
                  <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Documentation = () => {
  const navigate = useNavigate();
  const [allOpen, setAllOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FileText size={14} />
            Technical Documentation — Patent Style
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            NetCast{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Predictive Network Operations Center Platform — Full Technical Specification
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-5">
            {['ITU-R P.838', 'ITU-T Y.1541', 'RFC 3550', 'OSI Model', 'SHA-256', 'TCP/IP'].map(tag => (
              <span
                key={tag}
                className="bg-slate-800 border border-slate-600 text-gray-300 text-xs px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pages / Modules', value: '8', color: '#a78bfa' },
            { label: 'Telecom Standards', value: '5', color: '#22d3ee' },
            { label: 'Security Layers', value: 'SHA-256', color: '#22c55e' },
            { label: 'Deployment', value: 'Vercel', color: '#f97316' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center"
            >
              <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map(section => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-600 text-xs pb-8">
          <p>© 2025 NetCast AI — Logith. All Rights Reserved. Patent Documentation.</p>
          <p className="mt-1">Standards: ITU-R P.838 · ITU-T Y.1541 · RFC 3550 · RFC 1918 · OSI 7-Layer Model</p>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
