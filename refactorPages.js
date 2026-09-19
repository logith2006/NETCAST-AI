const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'netcast-ai', 'src');
const pagesDir = path.join(srcDir, 'pages');

// 1. Create Devices.jsx
const devicesContent = `import React from 'react';
import { Users, Server, Laptop, Tv, Smartphone, Tablet, HelpCircle, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const generateMockDevices = (count) => {
  const vendors = [
    { name: 'Samsung S23', icon: Smartphone },
    { name: 'Desktop PC', icon: Server },
    { name: 'MacBook Pro', icon: Laptop },
    { name: 'Smart TV', icon: Tv },
    { name: 'iPad Air', icon: Tablet },
    { name: 'Unknown Device', icon: HelpCircle }
  ];
  const devices = [];
  for (let i = 0; i < count; i++) {
    const vendorIndex = (i * 17) % vendors.length; 
    devices.push({ id: \`dev-\${i}\`, ...vendors[vendorIndex] });
  }
  return devices;
};

const Devices = () => {
  const navigate = useNavigate();
  const devices = generateMockDevices(12); // Simulated connected devices

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-cyan-400" size={32} /> Connected Devices
          </h1>
          <p className="text-gray-400 mb-8">Manage and monitor all devices currently connected to your network.</p>
          
          <div className="space-y-4">
            {devices.map((dev, i) => {
              const Icon = dev.icon;
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-800/80 rounded-2xl border border-gray-700/50 hover:bg-gray-700/50 transition">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Icon size={24} /></div>
                    <div>
                      <p className="text-white font-bold text-lg">{dev.name}</p>
                      <p className="text-sm text-gray-400">IP: 192.168.1.{100 + i}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-sm font-bold text-emerald-500">Connected</span>
                    </div>
                    <span className="text-xs text-gray-500">Active now</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Devices;`;

fs.writeFileSync(path.join(pagesDir, 'Devices.jsx'), devicesContent, 'utf8');

// 2. Create Latency.jsx
const latencyContent = `import React from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Latency = () => {
  const navigate = useNavigate();
  const forecastData = [
    { time: 'Now', actual: 20, predicted: 20, threshold: 50 },
    { time: '+10m', predicted: 23, threshold: 50 },
    { time: '+20m', predicted: 32, threshold: 50 },
    { time: '+30m', predicted: 44, threshold: 50 },
    { time: '+40m', predicted: 36, threshold: 50 },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="text-yellow-400" size={32} /> Latency Forecast Analysis
          </h1>
          <p className="text-gray-400 mb-8">Detailed predictive modeling for network response times.</p>
          
          <div className="h-[400px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                <Legend verticalAlign="top" height={36}/>
                <ReferenceLine y={50} label={{ position: 'insideTopLeft', value: 'Congestion Threshold', fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Latency (ms)" connectNulls />
                <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted Latency" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="overflow-x-auto bg-slate-800/80 rounded-2xl border border-gray-700/50 p-6">
            <table className="w-full text-left text-sm text-white">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Predicted Latency</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-4">+10 min</td><td className="py-4">23 ms</td><td className="py-4 text-emerald-500 font-bold">Normal</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4">+20 min</td><td className="py-4">32 ms</td><td className="py-4 text-amber-500 font-bold">Moderate</td>
                </tr>
                <tr>
                  <td className="py-4">+30 min</td><td className="py-4">44 ms</td><td className="py-4 text-red-500 font-bold">Warning</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Latency;`;

fs.writeFileSync(path.join(pagesDir, 'Latency.jsx'), latencyContent, 'utf8');

// 3. Update App.jsx routing
const appJsxPath = path.join(srcDir, 'App.jsx');
let appContent = fs.readFileSync(appJsxPath, 'utf8');

if (!appContent.includes('SpeedTest')) {
  appContent = appContent.replace(
    /import Dashboard from '\.\/pages\/Dashboard';/,
    `import Dashboard from './pages/Dashboard';\nimport SpeedTest from './pages/SpeedTest';\nimport Devices from './pages/Devices';\nimport Latency from './pages/Latency';`
  );
  
  appContent = appContent.replace(
    /<Route path="\*" element=\{<Navigate to=\{user \? "\/" : "\/login"\} \/>\} \/>/,
    `<Route path="/speedtest" element={user ? <SpeedTest /> : <Navigate to="/login" />} />
        <Route path="/devices" element={user ? <Devices /> : <Navigate to="/login" />} />
        <Route path="/latency" element={user ? <Latency /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />`
  );
  fs.writeFileSync(appJsxPath, appContent, 'utf8');
}

// 4. Update Dashboard.jsx (Remove Modals, Route to pages, Add Weather Widget)
const dashboardPath = path.join(pagesDir, 'Dashboard.jsx');
let dashContent = fs.readFileSync(dashboardPath, 'utf8');

// Change Speed Test button to Navigate
dashContent = dashContent.replace(
  /onClick=\{\(\) => setIsSpeedTestModalOpen\(true\)\}/,
  `onClick={() => navigate('/speedtest')}`
);

// Change Devices button to Navigate
dashContent = dashContent.replace(
  /onClick=\{\(\) => setIsDevicesModalOpen\(true\)\}/,
  `onClick={() => navigate('/devices')}`
);

// Add Weather Card in secondary metrics row
// Instead of 3 columns, let's make it 4 columns if we add Weather, or just replace Jitter/Packet Loss with Weather
dashContent = dashContent.replace(
  /<div className="grid grid-cols-1 md:grid-cols-3 gap-6">/,
  `<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Weather Widget */}
          <motion.div variants={itemVariants} className={\`p-6 rounded-2xl border \${cardBg} flex flex-col justify-center \${weatherWarning ? 'border-red-500/50 bg-red-500/10' : ''}\`}>
            <div className="flex items-center gap-2 mb-2">
              {weatherWarning ? <CloudLightning className="text-red-400" size={24} /> : <Cloud className="text-sky-400" size={24} />}
              <h3 className={\`\${textMuted} font-medium text-sm\`}>Live Weather</h3>
            </div>
            <div className={\`text-3xl font-bold \${textMain}\`}>
              {weatherWarning ? 'Storm' : 'Clear'}
            </div>
            <p className={\`text-xs mt-2 font-bold \${weatherWarning ? 'text-red-500' : 'text-emerald-500'}\`}>
              {weatherWarning ? 'Collision Warning!' : 'Network conditions optimal'}
            </p>
          </motion.div>`
);

// Change Latency section in Dashboard to have a "View Forecast" button
dashContent = dashContent.replace(
  /<\/LineChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>/,
  `</LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <button onClick={() => navigate('/latency')} className="mt-4 w-full py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2">
              <ActivitySquare size={14} /> Full Latency Analysis
            </button>`
);

// Remove the giant Advanced Area Chart (Latency Forecast Analysis) from dashboard since it's on a separate page
dashContent = dashContent.replace(
  /<motion\.div variants=\{itemVariants\} className=\{\`p-6 rounded-2xl border \$\{cardBg\} lg:col-span-2 min-h-\[400px\] flex flex-col\`\}>[\s\S]*?<\/motion\.div>/,
  `` // delete it
);

// Remove Forecast Table
dashContent = dashContent.replace(
  /<motion\.div variants=\{itemVariants\} className=\{\`p-6 rounded-2xl border \$\{cardBg\}\`\}>\s*<h3 className=\{\`text-lg font-bold \$\{textMain\} mb-4\`\}>Forecast Table<\/h3>[\s\S]*?<\/motion\.div>/,
  `` // delete it
);

// Remove Modals from the bottom
dashContent = dashContent.replace(
  /\{\/\* Speed Test Premium Modal \*\/\}[\s\S]*?<\/AnimatePresence>/,
  `` // remove modal
);
dashContent = dashContent.replace(
  /\{\/\* Connected Devices Detailed Modal \*\/\}[\s\S]*?<\/AnimatePresence>/,
  `` // remove modal
);

fs.writeFileSync(dashboardPath, dashContent, 'utf8');

console.log('Refactoring complete!');
