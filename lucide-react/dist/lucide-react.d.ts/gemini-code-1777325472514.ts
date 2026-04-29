import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

/**
 * Custom Type Definitions for Firewall Automation Tool
 */
export type SecurityIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

export interface FirewallAutomationIcons {
  Firewall: SecurityIcon;
  Automation: SecurityIcon;
  Rule: SecurityIcon;
  Shield: SecurityIcon;
}