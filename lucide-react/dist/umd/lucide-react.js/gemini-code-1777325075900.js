import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Settings2,
  Power
} from 'lucide-react';

const FirewallRule = ({ ruleName, port, protocol, direction, initialStatus }) => {
  const [isActive, setIsActive] = useState(initialStatus);

  return (
    <div className={`flex items-center justify-between p-4 mb-3 rounded-lg border transition-all ${
      isActive ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'
    }`}>
      <div className="flex items-center gap-4">
        {/* Status Icon */}
        <div className={`p-2 rounded-full ${isActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
          {isActive ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
        </div>

        {/* Rule Details */}
        <div>
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            {ruleName}
            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
              {protocol}:{port}
            </span>
          </h4>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            {direction === 'inbound' ? (
              <><ArrowDownLeft size={14} className="mr-1 text-blue-500" /> Inbound</>
            ) : (
              <><ArrowUpRight size={14} className="mr-1 text-orange-500" /> Outbound</>
            )}
          </div>
        </div>
      </div>

      {/* Automation Tools/Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`p-2 rounded-md transition-colors ${
            isActive ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-200'
          }`}
          title="Toggle Rule"
        >
          <Power size={18} />
        </button>
        
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md">
          <Settings2 size={18} />
        </button>
        
        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

// Example Usage
export default function FirewallManager() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-100 min-h-screen">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Automation Rules</h2>
        <p className="text-slate-500 text-sm">Manage your active network security filters.</p>
      </header>
      
      <FirewallRule ruleName="Allow HTTPS" port="443" protocol="TCP" direction="inbound" initialStatus={true} />
      <FirewallRule ruleName="Block SSH" port="22" protocol="TCP" direction="inbound" initialStatus={false} />
      <FirewallRule ruleName="Cloud Sync" port="8080" protocol="UDP" direction="outbound" initialStatus={true} />
    </div>
  );
}