import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2, History, Smartphone, CloudLightning, Sun, CloudRain, Thermometer, Wind } from 'lucide-react';

const Monitor = () => {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  // Fetch Weather Data (Using Open-Meteo free API - Defaulting to Chennai coordinates for Demo)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current_weather=true');
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Failed to fetch weather", error);
      }
      setLoadingWeather(false);
    };
    
    fetchWeather();
  }, []);

  const alerts = [
    { id: 1, type: 'warning', message: 'High latency detected', time: '10 mins ago', value: '142ms' },
    { id: 2, type: 'success', message: 'Network restored', time: '1 hour ago', value: 'Stable' },
    { id: 3, type: 'danger', message: 'Connection dropped', time: '2 hours ago', value: 'Offline' }
  ];

  const appUsage = [
    { id: 1, name: 'YouTube', usage: '1.2 GB', icon: '▶️' },
    { id: 2, name: 'Instagram', usage: '840 MB', icon: '📷' },
    { id: 3, name: 'WhatsApp', usage: '120 MB', icon: '💬' }
  ];

  // Helper to determine weather impact on network
  const getWeatherImpact = (weatherCode) => {
    // Open-Meteo WMO Weather interpretation codes
    if (!weatherCode) return { icon: <Sun className="w-8 h-8 text-yellow-500" />, status: 'Optimal', text: 'Clear skies. Network conditions are optimal.', color: 'emerald' };
    
    if (weatherCode >= 50 && weatherCode <= 67) { // Rain
      return { icon: <CloudRain className="w-8 h-8 text-blue-500" />, status: 'Minor Disruption', text: 'Rain detected. Expect minor latency spikes on wireless networks.', color: 'orange' };
    } else if (weatherCode >= 80 || weatherCode === 95 || weatherCode === 99) { // Heavy Rain / Thunderstorm
      return { icon: <CloudLightning className="w-8 h-8 text-purple-500" />, status: 'High Risk', text: 'Thunderstorm in area. High risk of cellular network drops.', color: 'red' };
    }
    
    return { icon: <Sun className="w-8 h-8 text-yellow-500" />, status: 'Optimal', text: 'Normal weather. Network should be stable.', color: 'emerald' };
  };

  const impact = getWeatherImpact(weather?.weathercode);

  return (
    <div className="p-6 pt-12 min-h-screen pb-24">
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Monitor</h1>
      <p className="text-slate-500 mb-6">AI Network & Weather Analysis</p>

      {/* Stability Score Card */}
      <div className="glass-card p-6 mb-6 bg-gradient-to-br from-pink-500 to-rose-400 text-white relative overflow-hidden shadow-lg shadow-pink-200">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-pink-100 font-medium text-sm uppercase tracking-wider mb-1">Stability Score</p>
            <h2 className="text-4xl font-bold">98<span className="text-xl text-pink-200">/100</span></h2>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm bg-black/10 w-fit px-3 py-1.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>Network is highly stable</span>
        </div>
      </div>

      {/* AI Weather & Network Predictor (UNIQUE FEATURE) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CloudLightning className="w-5 h-5 text-indigo-500" />
            Weather Impact AI
          </h3>
          <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Live</span>
        </div>
        
        <div className="glass-card p-5 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
          {loadingWeather ? (
             <div className="animate-pulse flex space-x-4">
               <div className="rounded-full bg-slate-200 h-10 w-10"></div>
               <div className="flex-1 space-y-3 py-1">
                 <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                 <div className="h-2 bg-slate-200 rounded w-1/2"></div>
               </div>
             </div>
          ) : (
            <>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                  {impact.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-1">{weather?.temperature}°C</h4>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Wind className="w-3 h-3" /> Wind: {weather?.windspeed} km/h
                  </p>
                </div>
                <div className="ml-auto">
                   <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                     impact.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                     impact.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                     'bg-red-100 text-red-600'
                   }`}>
                     {impact.status}
                   </span>
                </div>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-white">
                <p className="text-sm text-slate-600 font-medium">
                  {impact.text}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-pink-500" />
            Network Log
          </h3>
        </div>
        
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="glass-card p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                alert.type === 'warning' ? 'bg-orange-100 text-orange-500' :
                alert.type === 'success' ? 'bg-emerald-100 text-emerald-500' :
                'bg-red-100 text-red-500'
              }`}>
                {alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                 alert.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                 <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{alert.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{alert.time}</p>
              </div>
              <div className="text-sm font-semibold text-slate-600">
                {alert.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Data Usage (Mock Demo) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-pink-500" />
            App Data Usage
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Demo</span>
        </div>
        
        <div className="glass-card p-2">
          {appUsage.map((app, index) => (
            <div key={app.id} className={`flex items-center justify-between p-3 ${index !== appUsage.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{app.icon}</span>
                <span className="font-medium text-slate-700">{app.name}</span>
              </div>
              <span className="text-sm font-bold text-slate-500">{app.usage}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Monitor;
