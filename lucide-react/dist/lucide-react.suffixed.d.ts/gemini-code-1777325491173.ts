import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

/**
 * SUFFIXED TYPE DEFINITIONS
 * Logic for the .d.ts layer to ensure all automation icons
 * follow the NameSuffix naming convention.
 */
export type IconElement = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

export interface SuffixedAutomationRegistry {
  ShieldRule: IconElement;
  ZapAutomation: IconElement;
  ListRule: IconElement;
  ActivityAutomation: IconElement;
  LockRule: IconElement;
}

/**
 * IMPLEMENTATION
 * Mapping specific Lucide icons to your suffixed automation keys.
 */
const Registry: SuffixedAutomationRegistry = {
  ShieldRule: LucideIcons.ShieldCheck,
  ZapAutomation: LucideIcons.Zap,
  ListRule: LucideIcons.TableProperties,
  ActivityAutomation: LucideIcons.Activity,
  LockRule: LucideIcons.LockKeyhole,
};

interface AutomationToolProps extends LucideProps {
  /** The specific suffixed key from the registry */
  iconKey: keyof SuffixedAutomationRegistry;
  /** Optional badge for rule priority or automation status */
  priority?: 'high' | 'low' | 'none';
}

/**
 * SINGLE CODE COMPONENT
 * Handles the rendering of suffixed firewall and automation icons.
 */
export const FirewallAutomationTool = ({ 
  iconKey, 
  priority = 'none', 
  ...props 
}: AutomationToolProps) => {
  const Icon = Registry[iconKey];

  if (!Icon) {
    console.warn(`Icon key "${iconKey}" not found in suffixed registry.`);
    return null;
  }

  // Logic: Automations are usually "Electric Blue", Rules are "Slate/Steel"
  const getThemeColor = () => {
    if (iconKey.endsWith('Automation')) return '#3b82f6';
    if (iconKey.endsWith('Rule')) return '#64748b';
    return props.color;
  };

  const finalColor = props.color || getThemeColor();

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <Icon 
        {...props} 
        color={finalColor} 
        strokeWidth={props.strokeWidth || 1.5} 
      />
      {priority === 'high' && (
        <span style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: 8,
          height: 8,
          backgroundColor: '#ef4444',
          borderRadius: '50%',
          border: '2px solid white'
        }} />
      )}
    </div>
  );
};