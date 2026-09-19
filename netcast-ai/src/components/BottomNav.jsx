import React from 'react';
import { Home, Gauge, Activity, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/speedtest', icon: Gauge, label: 'Speed' },
    { path: '/monitor', icon: Activity, label: 'Monitor' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 pb-safe pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto mb-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center p-2"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-pink-100 text-pink-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive ? 'text-pink-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
