import React, { useState, useEffect } from 'react';
import { ArrowLeft, Terminal, Server, ShieldAlert, Cpu, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Diagnostics = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [tcpCount, setTcpCount] = useState(0);
  const [udpCount, setUdpCount] = useState(0);
  const [dropped, setDropped] = useState(0);

  useEffect(() => {
    const protocols = ['TCP', 'UDP', 'ICMP'];
    const ports = [443, 80, 53, 22, 8080];
    const flags = ['[SYN]', '[ACK]', '[FIN, ACK]', '[RST]', ''];

    const generateLog = () => {
      const proto = protocols[Math.floor(Math.random() * protocols.length)];
      const isDrop = Math.random() > 0.95;
      const srcPort = ports[Math.floor(Math.random() * ports.length)];
      const dstPort = ports[Math.floor(Math.random() * ports.length)];
      const ip1 = Math.floor(Math.random() * 255);
      const ip2 = Math.floor(Math.random() * 255);
      const flag = flags[Math.floor(Math.random() * flags.length)];
      const seq = Math.floor(Math.random() * 1000);
      const len = Math.floor(Math.random() * 1500);

      const log = {
        id: Date.now() + Math.random(),
        time: new Date().toISOString().split('T')[1].slice(0, 12),
        src: '192.168.1.' + ip1 + ':' + srcPort,
        dst: '104.21.45.' + ip2 + ':' + dstPort,
        proto: proto,
        info: isDrop
          ? 'Retransmission (Packet Drop)'
          : proto + ' ' + flag + ' Seq=' + seq + ' Win=64240 Len=' + len,
        status: isDrop ? 'drop' : 'ok',
      };

      if (proto === 'TCP') setTcpCount(p => p + 1);
      if (proto === 'UDP') setUdpCount(p => p + 1);
      if (isDrop) setDropped(p => p + 1);

      setLogs(prev => [log, ...prev].slice(0, 50));
    };

    const interval = setInterval(generateLog, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 font-mono">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 font-sans transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3 font-sans">
              <Terminal className="text-purple-400" size={28} /> Deep Packet Inspection & OSI Analysis
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-sans">
              Real-time TCP/UDP traffic analysis and L3/L4 packet loss detection.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-blue-400 mb-1">TCP Packets</p>
              <p className="text-xl font-bold text-white">{tcpCount}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-emerald-400 mb-1">UDP Datagrams</p>
              <p className="text-xl font-bold text-white">{udpCount}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-red-400 mb-1">Dropped (L3)</p>
              <p className="text-xl font-bold text-red-500">{dropped}</p>
            </div>
          </div>
        </div>

        {/* OSI Layer Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-800/60 border border-slate-700/50 p-5 rounded-xl">
            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
              <Network size={16} /> Layer 3 (Network)
            </h3>
            <p className="text-xs text-gray-400">
              Monitoring IPv4 Routing and ICMP ping latency to detect network congestion.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 p-5 rounded-xl">
            <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
              <Server size={16} /> Layer 4 (Transport)
            </h3>
            <p className="text-xs text-gray-400">
              Analyzing TCP Handshakes [SYN, ACK] and UDP streaming flows for Jitter.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 p-5 rounded-xl">
            <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
              <Cpu size={16} /> Traffic Load
            </h3>
            <p className="text-xs text-gray-400">
              Bandwidth absorption driven by TCP Window Size scaling across devices.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 p-5 rounded-xl">
            <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <ShieldAlert size={16} /> Packet Loss
            </h3>
            <p className="text-xs text-gray-400">
              Retransmission events trigger AI warnings for Rain Fade interference.
            </p>
          </div>
        </div>

        {/* Wireshark-style Log Table */}
        <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-4 text-xs text-gray-400 border-b border-gray-700">
            <div className="w-28">Time</div>
            <div className="w-36">Source</div>
            <div className="w-36">Destination</div>
            <div className="w-16">Protocol</div>
            <div className="flex-1">Info</div>
          </div>
          <div className="h-96 overflow-y-auto p-2 text-xs">
            {logs.map(log => (
              <div
                key={log.id}
                className={
                  'flex items-center gap-4 px-2 py-1.5 border-b border-gray-800/50 ' +
                  (log.status === 'drop'
                    ? 'bg-red-500/20 text-red-300'
                    : 'text-gray-300 hover:bg-gray-800')
                }
              >
                <div className="w-28 text-gray-500">{log.time}</div>
                <div className="w-36">{log.src}</div>
                <div className="w-36">{log.dst}</div>
                <div
                  className={
                    'w-16 font-bold ' +
                    (log.proto === 'TCP'
                      ? 'text-blue-400'
                      : log.proto === 'UDP'
                      ? 'text-emerald-400'
                      : 'text-yellow-400')
                  }
                >
                  {log.proto}
                </div>
                <div className="flex-1 truncate">{log.info}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Diagnostics;
