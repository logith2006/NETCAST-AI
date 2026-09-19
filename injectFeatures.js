const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'netcast-ai', 'src', 'pages', 'Dashboard.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update Imports
content = content.replace(
  /import {([^}]+)} from 'lucide-react';/,
  `import {$1, Home, CloudRain, Cloud, CloudLightning, Gauge, X, BarChart, Eye, LayoutDashboard} from 'lucide-react';`
);

content = content.replace(
  /import { AreaChart([^}]+)} from 'recharts';/,
  `import { AreaChart$1, LineChart, Line, BarChart as RechartsBarChart, Bar } from 'recharts';`
);

// 2. Add New States & Mock Data
content = content.replace(
  /const \[loading, setLoading\] = useState\(true\);/,
  `const [loading, setLoading] = useState(true);
  
  // Enhancements State
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [isSpeedTestModalOpen, setIsSpeedTestModalOpen] = useState(false);
  const [weatherWarning, setWeatherWarning] = useState(null);
  const [testProgress, setTestProgress] = useState(0);
  
  const latencyHistory = [
    { time: '1', ping: 20 }, { time: '2', ping: 24 }, { time: '3', ping: 18 },
    { time: '4', ping: 25 }, { time: '5', ping: 21 }, { time: '6', ping: 19 },
    { time: '7', ping: 22 }, { time: '8', ping: 20 }
  ];
  
  const appUsageData = [
    { name: 'Netflix', value: 45, fill: '#ef4444' },
    { name: 'YouTube', value: 25, fill: '#f87171' },
    { name: 'Insta', value: 15, fill: '#ec4899' },
    { name: 'System', value: 10, fill: '#3b82f6' },
    { name: 'Other', value: 5, fill: '#94a3b8' }
  ];`
);

// 3. Add Weather Logic to fetchData
content = content.replace(
  /setLoading\(false\);\s*}/,
  `setLoading(false);
      }
      
      // Weather Collision Logic (Trigger on render)
      const weathers = ['Clear', 'Rain', 'Storm'];
      const currentW = weathers[Math.floor(Math.random() * weathers.length)];
      if (currentW === 'Rain' || currentW === 'Storm') {
        setWeatherWarning("⚠️ Bad weather detected. Network collision & latency spikes expected.");
      } else {
        setWeatherWarning(null);
      }`
);

// 4. Update Header Buttons (Add Home Button)
content = content.replace(
  /<button onClick={toggleTheme}/,
  `<button onClick={() => navigate('/welcome')} className={\`p-2 rounded-lg hover:bg-gray-500/10 \${textMuted} transition font-bold flex items-center gap-2\`} title="Back to Home">
              <Home size={20} /> <span className="hidden lg:block text-sm">Home</span>
            </button>
            <button onClick={toggleTheme}`
);

// 5. Add Weather Warning Toast
content = content.replace(
  /<motion\.header/,
  `<AnimatePresence>
        {weatherWarning && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-2xl shadow-red-500/50 font-bold flex items-center gap-3 border-2 border-red-400">
            <CloudLightning className="animate-pulse" />
            {weatherWarning}
            <button onClick={() => setWeatherWarning(null)} className="ml-2 hover:text-red-200"><X size={18}/></button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.header`
);

// 6. Add Premium Speed Test Button to Metrics Row
content = content.replace(
  /{title: 'Upload Speed'/,
  `{title: 'Upload Speed'` // dummy fallback
);

content = content.replace(
  /<div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-500">\s*Stable connection\s*<\/div>/,
  `<div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-500">
              Stable connection
            </div>
            <button onClick={() => setIsSpeedTestModalOpen(true)} className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 transition-all">
              <Gauge size={16} /> Premium Speed Test
            </button>`
);

// 7. Update Latency box with Graph
content = content.replace(
  /div className={\`text-4xl font-bold \${textMain} tracking-tight\`}>\s*\{networkData\.latency\}\s*<span className={\`text-sm \${textMuted} font-normal ml-1\`}>ms<\/span>\s*<\/div>\s*<div className={\`mt-4 flex items-center gap-2 text-xs font-medium [^>]+\`}>\s*[^<]+\s*<\/div>/,
  `div className="flex items-end justify-between">
              <div>
                <div className={\`text-4xl font-bold \${textMain} tracking-tight\`}>
                  {networkData.latency}
                  <span className={\`text-sm \${textMuted} font-normal ml-1\`}>ms</span>
                </div>
                <div className={\`mt-2 flex items-center gap-2 text-xs font-medium \${networkData.latency < 40 ? 'text-emerald-500' : 'text-red-500'}\`}>
                  {networkData.latency < 40 ? 'Excellent response' : 'High delay'}
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyHistory}>
                    <Line type="monotone" dataKey="ping" stroke="#eab308" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>`
);

// 8. Update Connected Devices Box
content = content.replace(
  /<div className="space-y-3">\s*\{generateMockDevices\(networkData\.connectedDevices\)\.map\(\(dev, i\) => \{\s*const Icon = dev\.icon;\s*return \([\s\S]*?\}\s*<\/div>/,
  `<button onClick={() => setIsDevicesModalOpen(true)} className="w-full mt-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl flex justify-center items-center gap-2 transition-all">
              <Eye size={18} /> View Detailed List
            </button>`
);

// 9. Replace App Usage box (Adding it right next to AI Prediction)
content = content.replace(
  /{title: 'App Usage'/,
  `{title: 'App Usage'` // dummy
);

// We will insert App Usage Widget after Forecast Table
content = content.replace(
  /<\/table>\s*<\/div>\s*<\/motion\.div>/,
  `</table>
            </div>
          </motion.div>
          
          {/* App Data Usage Tracker */}
          <motion.div variants={itemVariants} className={\`p-6 rounded-2xl border \${cardBg}\`}>
            <h3 className={\`text-lg font-bold \${textMain} mb-4 flex items-center justify-between\`}>
              <span className="flex items-center gap-2"><LayoutDashboard size={20} className="text-pink-500"/> Data Absorption</span>
            </h3>
            <div className="h-40 w-full mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={appUsageData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: isDark ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <p className={\`text-xs \${textMuted} text-center\`}>Apps consuming highest bandwidth</p>
          </motion.div>`
);

// 10. Inject Modals before closing div
content = content.replace(
  /<\/div>\s*<\/div>\s*\);\s*}\s*export default Dashboard;/,
  `</div>

      {/* Speed Test Premium Modal */}
      <AnimatePresence>
        {isSpeedTestModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={\`\${cardBg} w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden\`}>
              <button onClick={() => setIsSpeedTestModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 text-center">PREMIUM SPEED TEST</h2>
              
              <div className="flex justify-center mb-8">
                <CircularGauge percentage={networkData.downloadSpeed > 0 ? networkData.downloadSpeed : 85} color="#8b5cf6" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Download</p>
                  <p className="text-3xl font-bold text-white">{networkData.downloadSpeed > 0 ? networkData.downloadSpeed : 85.4} <span className="text-sm">Mbps</span></p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Upload</p>
                  <p className="text-3xl font-bold text-white">{networkData.uploadSpeed > 0 ? networkData.uploadSpeed : 32.1} <span className="text-sm">Mbps</span></p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected Devices Detailed Modal */}
      <AnimatePresence>
        {isDevicesModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={\`\${cardBg} w-full max-w-2xl rounded-3xl p-8 border border-white/10 shadow-2xl relative max-h-[80vh] overflow-y-auto\`}>
              <button onClick={() => setIsDevicesModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Users className="text-cyan-400" /> Active Devices ({networkData.connectedDevices})</h2>
              
              <div className="space-y-4">
                {generateMockDevices(Math.max(5, networkData.connectedDevices)).map((dev, i) => {
                  const Icon = dev.icon;
                  return (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Icon size={24} /></div>
                        <div>
                          <p className="text-white font-bold">{dev.name}</p>
                          <p className="text-xs text-gray-400">192.168.1.{100 + i}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-500">Connected</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Dashboard;`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Dashboard updated with all requested features successfully!');
