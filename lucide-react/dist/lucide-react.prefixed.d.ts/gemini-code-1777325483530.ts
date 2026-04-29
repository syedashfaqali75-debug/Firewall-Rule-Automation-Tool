import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import { 
  ShieldAlert, 
  Zap, 
  ListChecks, 
  Lock, 
  LucideProps 
} from 'lucide-react';

/** * PREFIXED TYPE DEFINITIONS
 * This section acts as your .d.ts content to ensure 
 * strict typing for your automation tool.
 */
export type PrefixedIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

export interface AutomationRegistry {
  auto_firewall: PrefixedIcon;
  auto_trigger: PrefixedIcon;
  auto_rule_list: PrefixedIcon;
  auto_default: PrefixedIcon;
}

/**
 * THE REGISTRY
 * Maps internal automation IDs to Lucide components
 */
const ICON_REGISTRY: AutomationRegistry = {
  auto_firewall: ShieldAlert,
  auto_trigger: Zap,
  auto_rule_list: ListChecks,
  auto_default: Lock,
};

/**
 * COMPONENT PROPS
 */
interface FirewallRuleProps extends LucideProps {
  actionType: keyof AutomationRegistry;
  label?: string;
  isActive?: boolean;
}

/**
 * SINGLE CODE IMPLEMENTATION
 */
export const FirewallAutomationIcon = ({ 
  actionType, 
  isActive = true, 
  label, 
  ...props 
}: FirewallRuleProps) => {
  const IconComponent = ICON_REGISTRY[actionType] || ICON_REGISTRY.auto_default;

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        opacity: isActive ? 1 : 0.5 
      }}
    >
      <IconComponent 
        size={props.size || 20} 
        strokeWidth={props.strokeWidth || 2}
        color={isActive ? props.color : '#94a3b8'} 
        {...props} 
      />
      {label && <span style={{ fontWeight: 500 }}>{label}</span>}
    </div>
  );
};

// Example usage:
// <FirewallAutomationIcon actionType="auto_firewall" label="Block Inbound" color="red" />