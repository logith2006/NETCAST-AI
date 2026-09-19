import React from 'react';
import { Users, Server, Laptop, Tv, Smartphone, Tablet, HelpCircle, ArrowLeft, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const allDevices = [
  { name: 'Samsung S23', icon: Smartphone, ip: '192.168.1.101', type: 'Mobile', speed: '12 Mbps' },
  { name: 'Desktop PC', icon: Server, ip: '192.168.1.100', type: 'Computer', speed: '42 Mbps' },
  { name: 'MacBook Pro', icon: Laptop, ip: '192.168.1.102', type: 'Laptop', speed: '28 Mbps' },
  { name: 'Smart TV (Samsung)', icon: Tv, ip: '192.168.1.103', type: 'TV', speed: '18 Mbps' },
  { name: 'iPad Air', icon: Tablet, ip: '192.168.1.104', type: 'Tablet', speed: '9 Mbps' },
  { name: 'iPhone 15', icon: Smartphone, ip: '192.168.1.105', type: 'Mobile', speed: '7 Mbps' },
  { name: 'Redmi Note 12', icon: Smartphone, ip: '192.168.1.106', type: 'Mobile', speed: '5 Mbps' },
  { name: 'Unknown Device', icon: HelpCircle, ip: '192.168.1.107', type: 'Unknown', speed: '2 Mbps' },
  { name: 'ASUS Laptop', icon: Laptop, ip: '192.168.1.108', type: 'Laptop', speed: '15 Mbps' },
  { name: 'Amazon Fire TV', icon: Tv, ip: '192.168.1.109', type: 'TV', speed: '11 Mbps' },
];

const Devices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-3 bg-cyan-500/20 rounded-2xl">
                <Users className="text-cyan-400" size={28} />
              </div>
              Connected Devices
            </h1>
            <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-sm font-bold">
              {allDevices.length} Active
            </span>
          </div>
          <p className="text-gray-400 ml-16">Monitor all devices currently connected to your network in real time.</p>
        </div>

        {/* Devices List */}
        <div className="space-y-3">
          {allDevices.map((dev, i) => {
            const Icon = dev.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-5 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-700/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{dev.name}</p>
                    <p className="text-sm text-gray-400">{dev.ip} · {dev.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <p className="text-white font-bold">{dev.speed}</p>
                    <p className="text-xs text-gray-500">Current Usage</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-emerald-500">Online</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Devices;
