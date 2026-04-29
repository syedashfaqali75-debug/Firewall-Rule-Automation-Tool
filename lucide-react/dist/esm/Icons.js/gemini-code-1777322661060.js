import { ShieldCheck, Zap, Ban, ListChecks } from 'lucide-react';

const RuleItem = ({ name, type }) => {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      {/* Icon logic based on rule type */}
      {type === 'firewall' && <ShieldCheck size={20} className="text-blue-500" />}
      {type === 'automation' && <Zap size={20} className="text-yellow-500" />}
      {type === 'block' && <Ban size={20} className="text-red-500" />}
      
      <span className="font-medium">{name}</span>
    </div>
  );
};