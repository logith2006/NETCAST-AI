import React, { useState } from 'react';
import { BarChart3, Clock, Smartphone, Globe, Shield, Search } from 'lucide-react';

const DataTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Simulated App Data Usage Timeline
  const usageData = [
    { id: 1, time: '10:30 AM', app: 'YouTube', category: 'Media', data: '450 MB', type: 'download', risk: 'safe' },
    { id: 2, time: '11:15 AM', app: 'Instagram', category: 'Social', data: '120 MB', type: 'download', risk: 'safe' },
    { id: 3, time: '01:45 PM', app: 'Zoom Meeting', category: 'Work', data: '850 MB', type: 'both', risk: 'safe' },
    { id: 4, time: '03:10 PM', app: 'Unknown IP (Background)', category: 'System', data: '12 MB', type: 'upload', risk: 'warning' },
    { id: 5, time: '04:00 PM', app: 'Chrome', category: 'Browser', data: '45 MB', type: 'download', risk: 'safe' },
    { id: 6, time: '05:30 PM', app: 'WhatsApp', category: 'Social', data: '25 MB', type: 'both', risk: 'safe' },
  ];

  const filteredData = usageData.filter(item => 
    item.app.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 min-h-[calc(100vh-64px)]">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
            <BarChart3 className="text-cyan-400" />
            Data Tracker AI
          </h1>
          <p className="text-slate-400">Monitor which apps are absorbing your network bandwidth in real-time.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 sm:text-sm backdrop-blur-sm"
            placeholder="Search apps or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 border-t-4 border-t-cyan-400">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Data Today</p>
          <h2 className="text-3xl font-bold text-white flex items-end gap-2">
            1.5 <span className="text-lg text-slate-500 mb-1">GB</span>
          </h2>
        </div>
        
        <div className="glass-card p-6 border-t-4 border-t-blue-500">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Top Absorber</p>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Zoom Meeting
          </h2>
        </div>

        <div className="glass-card p-6 border-t-4 border-t-orange-400">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Security Risks</p>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            1 <span className="text-lg text-slate-500 mb-1">Flagged</span>
            <Shield className="w-6 h-6 text-orange-400 ml-auto" />
          </h2>
        </div>
      </div>

      {/* Timeline List */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/30">
          <h3 className="text-lg font-semibold text-white">App Usage Timeline</h3>
        </div>
        
        <div className="divide-y divide-slate-700/50">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No matching apps found.</div>
          ) : (
            filteredData.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Time & App Info */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-slate-700/50 p-2 rounded-lg text-cyan-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-white">{item.app}</h4>
                      {item.risk === 'warning' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 uppercase tracking-wider">Background AI Alert</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Smartphone className="w-4 h-4" /> {item.category}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                {/* Data Absorbed */}
                <div className="sm:text-right">
                  <div className="text-xl font-bold text-cyan-300">{item.data}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {item.type === 'download' ? 'Downloaded' : item.type === 'upload' ? 'Uploaded' : 'In / Out'}
                  </div>
                </div>
                
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
};

export default DataTracker;
