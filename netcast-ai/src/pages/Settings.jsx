import React from 'react';
import { User, Bell, Shield, ChevronRight, LogOut, Info } from 'lucide-react';
import { auth, signOut } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

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

  const menuGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', value: 'Guest User' },
        { icon: Bell, label: 'Notifications', value: 'Enabled' },
      ]
    },
    {
      title: 'App',
      items: [
        { icon: Shield, label: 'Privacy Policy', value: '' },
        { icon: Info, label: 'About NetCast AI', value: 'v1.0.0' },
      ]
    }
  ];

  return (
    <div className="p-6 md:p-10 min-h-[calc(100vh-64px)] max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
        Settings
      </h1>
      <p className="text-slate-400 mb-10">Manage your preferences</p>

      {/* Profile Card */}
      <div className="glass-card p-6 mb-8 flex items-center gap-5 border border-slate-700">
        <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-cyan-400 font-bold text-2xl">
          G
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Guest User</h2>
          <p className="text-sm text-slate-400">Browsing in guest mode</p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1 text-xs font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full">Demo Mode</span>
        </div>
      </div>

      {/* Menu Groups */}
      <div className="space-y-6 mb-8">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">{group.title}</h3>
            <div className="glass-card overflow-hidden border border-slate-700">
              {group.items.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-4 hover:bg-slate-700/30 cursor-pointer transition-colors ${index !== group.items.length - 1 ? 'border-b border-slate-700/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-700/50 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-200">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">{item.value}</span>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
};

export default Settings;
