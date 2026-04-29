/**
 * Core types for Firewall Rule Automation
 */

export type Protocol = 'TCP' | 'UDP' | 'ICMP' | 'Any';
export type Action = 'Allow' | 'Deny';
export type Direction = 'Ingress' | 'Egress';

export interface FirewallRule {
  id: string;
  name: string;
  priority: number;
  direction: Direction;
  action: Action;
  protocol: Protocol;
  sourcePorts?: string[]; // e.g., ["80", "443"]
  destinationPorts?: string[];
  sourceAddressPrefixes: string[]; // CIDR notation
  destinationAddressPrefixes: string[];
  description?: string;
}

export interface AutomationResult {
  status: 'Success' | 'Failed' | 'NoChange';
  ruleId: string;
  timestamp: string;
  diff?: string; // Shows what changed
}

export interface FirewallManager {
  applyRule(rule: FirewallRule): Promise<AutomationResult>;
  deleteRule(ruleId: string): Promise<AutomationResult>;
  listRules(): Promise<FirewallRule[]>;
}