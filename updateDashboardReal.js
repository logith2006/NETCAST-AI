const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'netcast-ai', 'src', 'pages', 'Dashboard.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add imports for the new services
content = content.replace(
  /import { motion, AnimatePresence } from 'framer-motion';/,
  `import { motion, AnimatePresence } from 'framer-motion';\nimport { fetchRealTimeWeather } from '../services/weatherService';\nimport { measureRTT, getPacketDropRate, calculateJitter, addKPISample, getKPIHistory, classifyNetworkHealth, getUptime } from '../services/networkKPI';`
);

// 2. Remove the mock weather stuff
content = content.replace(
  /\/\/ Weather conditions \(mock\)[\s\S]*?const getWeather = \(\) => weatherConditions\[Math\.floor\(Math\.random\(\) \* weatherConditions\.length\)\];/,
  ``
);

// 3. Update the state in Dashboard
content = content.replace(
  /const \[weather, setWeather\] = useState\('Clear'\);/,
  `const [weatherData, setWeatherData] = useState(null);`
);

// 4. Update the Weather Check useEffect to use real API
content = content.replace(
  /\/\/ Weather check[\s\S]*?\}, \[\]\);/,
  `// Real Weather & Rain Attenuation check
  useEffect(() => {
    async function loadWeather() {
      const data = await fetchRealTimeWeather();
      setWeatherData(data);
      if (data.isRaining || data.isSevere) {
        setWeatherWarning(data.attenuation.warning || \`⚠️ \${data.label} detected! Signal attenuation expected.\`);
      }
    }
    loadWeather();
    const interval = setInterval(loadWeather, 15 * 60 * 1000); // Check every 15 mins
    return () => clearInterval(interval);
  }, []);`
);

// 5. Update Latency Simulation to use real Ping (RTT)
content = content.replace(
  /\/\/ Simulate latency updates[\s\S]*?\}, \[\]\);/,
  `// Real-time KPI updates (Ping/RTT)
  useEffect(() => {
    let isSubscribed = true;
    const updateKPIs = async () => {
      const { rtt, success } = await measureRTT();
      if (!isSubscribed) return;
      
      const dropRate = getPacketDropRate();
      const newHistory = addKPISample(rtt, 0, dropRate);
      const rttSamples = newHistory.map(s => s.rtt).filter(r => r > 0);
      const jitter = calculateJitter(rttSamples);
      
      setNetworkData(prev => ({
        ...prev,
        latency: success ? rtt : prev.latency, // keep old if failed, or show 0
        packetLoss: dropRate,
        jitter: jitter
      }));
      
      setLatencyHistory(newHistory.slice(-10).map((s, i) => ({ t: i+1, ping: s.rtt })));
    };
    
    // Initial fetch
    updateKPIs();
    // Poll every 2 seconds for real-time feel
    const interval = setInterval(updateKPIs, 2000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);`
);

// 6. Update Weather Icon and UI variables
content = content.replace(
  /const WeatherIcon = weather === 'Storm' \? CloudLightning : weather === 'Rain' \? CloudRain : Cloud;\s*const weatherColor = \(weather === 'Storm' \|\| weather === 'Rain'\) \? '#ef4444' : '#22d3ee';/,
  `const WeatherIcon = weatherData?.category === 'storm' ? CloudLightning : (weatherData?.category === 'rain' || weatherData?.category === 'heavy_rain') ? CloudRain : Cloud;
  const weatherColor = weatherData?.attenuation?.color || '#22d3ee';`
);

// 7. Update Weather UI Card
content = content.replace(
  /<div className=\{\`text-3xl font-bold \$\{textMain\}\`\}>\{weather\}<\/div>\s*<p className=\{\`text-xs mt-2 font-bold\`\} style=\{\{ color: weatherColor \}\}>\s*\{\(weather === 'Rain' \|\| weather === 'Storm'\) \? '⚠️ Network Collision Risk!' : '✅ Conditions Optimal'\}\s*<\/p>/,
  `<div className={\`text-3xl font-bold \${textMain}\`}>{weatherData?.label || 'Loading...'}</div>
            <p className={\`text-xs mt-2 font-bold\`} style={{ color: weatherColor }}>
              {weatherData?.attenuation?.warning ? weatherData.attenuation.warning : '✅ Conditions Optimal'}
            </p>`
);

// 8. Update Uptime in the footer
content = content.replace(
  /<span>Version 1.0 Enterprise<\/span>/,
  `<span>Version 1.0 Enterprise</span>
            <span>Uptime: {getUptime().formatted}</span>`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Real-time Weather & KPI Services integrated into Dashboard!');
