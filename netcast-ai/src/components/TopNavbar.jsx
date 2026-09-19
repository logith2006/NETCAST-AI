import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, Zap, ShieldAlert, BarChart3, Settings, LogOut } from 'lucide-react';
import { auth, signOut } from '../firebase';

const TopNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('demo_user');
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      localStorage.removeItem('demo_user');
      window.location.reload();
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Activity },
    { path: '/speedtest', label: 'Speed Test', icon: Zap },
    { path: '/monitor', label: 'Network Monitor', icon: ShieldAlert },
    { path: '/tracker', label: 'Data Tracker', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="glass-card sticky top-0 z-50 rounded-none border-t-0 border-l-0 border-r-0 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">NetCast AI</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      isActive 
                        ? 'bg-slate-700 text-cyan-400' 
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
