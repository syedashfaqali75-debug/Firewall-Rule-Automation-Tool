import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Settings2,
  Power,
  Plus
} from 'lucide-react';

const FirewallRule = ({ rule, onToggle, onDelete }) => {
  return (
    <div className={`flex items-center justify-between p-4 mb-3 rounded-xl border transition-all duration-200 ${
      rule.active ? 'bg-white border-blue-100 shadow-md' : 'bg-slate-50 border-slate-200 opacity-60'
    }`}>
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className={`p-2.5 rounded-lg ${rule.active ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
          {rule.active ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
        </div>

        {/* Rule Metadata */}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800">{rule.name}</h4>
            <span className="text-[10px] font-mono font-bold bg-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider text-slate-600">
              {rule.protocol}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center text-xs font-medium text-slate-500">
              {rule.direction === 'inbound' ? (
                <><ArrowDownLeft size={14} className="mr-1 text-blue-500" /> Inbound</>
              ) : (
                <><ArrowUpRight size={14} className="mr-1 text-orange-500" /> Outbound</>
              )}
            </div>
            <span className="text-xs text-slate-400">• Port {rule.port}</span>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onToggle(rule.id)}
          className={`p-2 rounded-lg transition-colors ${
            rule.active ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-200'
          }`}
          title={rule.active ? "Disable Rule" : "Enable Rule"}
        >
          <Power size={18} />
        </button>
        
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
          <Settings2 size={18} />
        </button>
        
        <button 
          onClick={() => onDelete(rule.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default function FirewallDashboard() {
  const [rules, setRules] = useState([
    { id: 1, name: 'Web Traffic (HTTPS)', port: '443', protocol: 'TCP', direction: 'inbound', active: true },
    { id: 2, name: 'SSH Remote Access', port: '22', protocol: 'TCP', direction: 'inbound', active: false },
    { id: 3, name: 'Database Sync', port: '5432', protocol: 'TCP', direction: 'outbound', active: true },
  ]);

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-slate-50 min-h-screen font-sans">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Firewall Rules</h1>
          <p className="text-slate-500 text-sm">Security Policy Automation</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-200">
          <Plus size={16} /> New Rule
        </button>
      </header>
      
      <div className="space-y-1">
        {rules.length > 0 ? (
          rules.map(rule => (
            <FirewallRule 
              key={rule.id} 
              rule={rule} 
              onToggle={toggleRule} 
              onDelete={deleteRule} 
            />
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
            No active rules found.
          </div>
        )}
      </div>
    </div>
  );
}