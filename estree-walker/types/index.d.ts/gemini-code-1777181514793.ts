/**
 * Core Firewall Rule Definition and Automation Types
 */

export type Protocol = 'tcp' | 'udp' | 'icmp' | 'all';
export type Action = 'allow' | 'deny';
export type Direction = 'ingress' | 'egress';

/**
 * Metadata for tracking changes (The "Blame" object)
 */
export interface RuleMetadata {
    createdBy: string;
    createdAt: string; // ISO Date string
    ticketReference: string;
    lastModifiedBy?: string;
    version: number;
}

/**
 * Main Firewall Rule Interface
 */
export interface FirewallRule {
    id: string;
    name: string;
    description: string;
    direction: Direction;
    action: Action;
    protocol: Protocol;
    sourceRanges: string[]; // CIDR notation
    destinationRanges: string[];
    ports: string[]; // e.g., ["80", "443", "1000-2000"]
    priority: number;
    metadata: RuleMetadata;
}

/**
 * Automation Tool Configuration
 */
export interface AutomationConfig {
    provider: 'aws' | 'gcp' | 'azure' | 'on-prem';
    dryRun: boolean;
    tags: Record<string, string>;
}