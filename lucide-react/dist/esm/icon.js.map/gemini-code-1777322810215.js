import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Zap, Settings, Activity } from 'lucide-react';

const FirewallAutomation = () => {
  const [rules, setRules] = useState([
    { id: 1, name: "Inbound SSH", status: "Active", type: "Security" },
    { id: 2, name: "Auto-Block Brute Force", status: "Automated", type: "Logic" },
  ]);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="text-blue-400" /> Automation Engine
        </h2>
        <Settings className="text-gray-400 cursor-pointer hover:rotate-90 transition-transform" />
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {rule.type === "Security" ? 
                <ShieldCheck className="text-green-400" /> : 
                <Zap className="text-yellow-400" />
              }
              <div>
                <p className="font-medium">{rule.name}</p>
                <span className="text-xs text-gray-400">{rule.status}</span>
              </div>
            </div>
            <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors">
        Deploy New Rule
      </button>
    </div>
  );
};

export default FirewallAutomation;